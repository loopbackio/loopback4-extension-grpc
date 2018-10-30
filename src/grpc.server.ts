import {
  Application,
  CoreBindings,
  BindingKey,
  Server,
  ControllerClass,
} from '@loopback/core';
import {MetadataInspector} from '@loopback/metadata';
import {Context, inject} from '@loopback/context';
import {GRPC_METHODS} from './decorators/grpc.decorator';
import {GrpcBindings} from './keys';
import {GrpcSequence} from './grpc.sequence';
import {Config} from './types';
import * as grpc from 'grpc';
import {GrpcGenerator} from './grpc.generator';
import {BindingScope} from '@loopback/context/dist/src/binding';
const debug = require('debug')('loopback:grpc:server');
/**
 * @class GrpcServer
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description
 * This Class provides a LoopBack Server implementing GRPC
 */
export class GrpcServer extends Context implements Server {
  /**
   * @memberof GrpcServer
   * Creates an instance of GrpcServer.
   *
   * @param {Application} app The application instance (injected via
   * CoreBindings.APPLICATION_INSTANCE).
   * @param {grpc.Server} server The actual GRPC Server module (injected via
   * GrpcBindings.GRPC_SERVER).
   * @param {GRPCServerConfig=} options The configuration options (injected via
   * GRPCBindings.CONFIG).
   *
   */

  listening: boolean = true;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) protected app: Application,
    @inject(GrpcBindings.GRPC_SERVER) protected server: grpc.Server,
    @inject(GrpcBindings.HOST) protected host: string,
    @inject(GrpcBindings.PORT) protected port: string,
    @inject(GrpcBindings.GRPC_GENERATOR) protected generator: GrpcGenerator,
  ) {
    super(app);
    // Execute TypeScript Generator. (Must be first one to load)
    this.generator.execute();
    // Setup Controllers
    for (const b of this.find('controllers.*')) {
      const controllerName = b.key.replace(/^controllers\./, '');
      const ctor = b.valueConstructor;
      if (!ctor) {
        throw new Error(
          `The controller ${controllerName} was not bound via .toClass()`,
        );
      }
      this._setupControllerMethods(ctor);
    }
  }

  async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.bind(
        `${this.host}:${this.port}`,
        grpc.ServerCredentials.createInsecure(),
      );
      this.server.start();
      resolve();
    });
  }

  async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.forceShutdown();
      resolve();
    });
  }

  private _setupControllerMethods(ctor: ControllerClass) {
    const className = ctor.name || '<UnknownClass>';
    const controllerMethods =
      MetadataInspector.getAllMethodMetadata<Config.Method>(
        GRPC_METHODS,
        ctor.prototype,
      ) || {};

    for (const methodName in controllerMethods) {
      const fullName = `${className}.${methodName}`;
      const config = controllerMethods[methodName];

      const proto: grpc.GrpcObject = this.generator.getProto(config.PROTO_NAME);
      if (!proto) {
        throw new Error(`Grpc Server: No proto file was provided.`);
      }

      const pkgMeta = proto[config.PROTO_PACKAGE] as grpc.GrpcObject;
      // tslint:disable-next-line:no-any
      const serviceMeta = pkgMeta[config.SERVICE_NAME] as any;
      // tslint:disable-next-line:no-any
      const serviceDef: grpc.ServiceDefinition<any> =
        { [methodName]: serviceMeta.service[methodName] };
      this.server.addService(serviceDef, {
        [config.METHOD_NAME]: this.setupGrpcCall(ctor, methodName, config),
      });
    }
  }
  /**
   * @method setupGrpcCall
   * @author Miroslav Bajtos
   * @author Jonathan Casarrubias
   * @author Simon Liang
   * @license MIT
   * @param ctor
   * @param methodName
   */
  private setupGrpcCall<T>(
    ctor: ControllerClass,
    methodName: string,
    config: Config.Method
    // tslint:disable-next-line:no-any
  ): grpc.handleCall<any, any> {
    const context: Context = this;

    context.bind(GrpcBindings.CONTEXT).to(context);
    context
      .bind(GrpcBindings.GRPC_CONTROLLER)
      .toClass(ctor)
      .inScope(BindingScope.CONTEXT);
    context.bind(GrpcBindings.GRPC_METHOD_NAME).to(methodName);
    const bindingKey: BindingKey<GrpcSequence> = BindingKey.create<GrpcSequence>(GrpcBindings.GRPC_SEQUENCE);

    if (config.REQUEST_STREAM) {
      if (config.RESPONSE_STREAM) {
        // bidi stream
        return function(
          // tslint:disable-next-line:no-any
          bidiStream: grpc.ServerDuplexStream<any, any>
        ) {
          context.get(bindingKey).then((sequence: GrpcSequence) => sequence.processBidiStream(bidiStream));
        };
      } else {
        // client streaming
        return function(
          // tslint:disable-next-line:no-any
          clientStream: grpc.ServerReadableStream<any>,
          // tslint:disable-next-line:no-any
          callback: grpc.sendUnaryData<any>
        ) {
          handleClientStream().then(
            result => callback(null, result),
            error => callback(error, null),
          );
          async function handleClientStream(): Promise<T> {
            const sequence: GrpcSequence = await context.get(bindingKey);
            return sequence.clientStreamingCall(clientStream);
          }
        }
      }
    } else {
      if (config.RESPONSE_STREAM) {
        // server streaming
        return function(
          // tslint:disable-next-line:no-any
          serverStream: grpc.ServerWriteableStream<any>
        ) {
          context.get(bindingKey).then((sequence: GrpcSequence) => sequence.processServerStream(serverStream));
        }
      } else {
        // unary call
        return function(
          // tslint:disable-next-line:no-any
          call: grpc.ServerUnaryCall<any>,
          // tslint:disable-next-line:no-any
          callback: grpc.sendUnaryData<any>,
        ) {
          handleUnary().then(
            result => callback(null, result),
            error => callback(error, null),
          );
          async function handleUnary(): Promise<T> {
            const sequence: GrpcSequence = await context.get(bindingKey);
            return sequence.unaryCall(call);
          }
        };
      }
    }
  }
}
