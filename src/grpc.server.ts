import {BindingScope, Context, inject} from '@loopback/context';
import {
  Application,
  ControllerClass,
  CoreBindings,
  Server,
} from '@loopback/core';
import {MetadataInspector} from '@loopback/metadata';
import * as grpc from 'grpc';
import {GRPC_METHODS} from './decorators/grpc.decorator';
import {GrpcGenerator} from './grpc.generator';
import {GrpcBindings} from './keys';
import {GrpcMethod} from './types';

// tslint:disable:no-any

/**
 * @class GrpcServer
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description
 * This Class provides a LoopBack Server implementing GRPC
 */
export class GrpcServer extends Context implements Server {
  private _listening = false;
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

  public get listening() {
    return this._listening;
  }

  async start(): Promise<void> {
    this.server.bind(
      `${this.host}:${this.port}`,
      grpc.ServerCredentials.createInsecure(),
    );
    this.server.start();
    this._listening = true;
  }

  async stop(): Promise<void> {
    this.server.forceShutdown();
    this._listening = false;
  }

  private _setupControllerMethods(ctor: ControllerClass) {
    const controllerMethods =
      MetadataInspector.getAllMethodMetadata<GrpcMethod>(
        GRPC_METHODS,
        ctor.prototype,
      ) || {};

    for (const methodName in controllerMethods) {
      const config = controllerMethods[methodName];

      const proto: grpc.GrpcObject = this.generator.getProto(config.PROTO_NAME);
      if (!proto) {
        throw new Error(`Grpc Server: No proto file was provided.`);
      }

      const pkgMeta = proto[config.PROTO_PACKAGE] as grpc.GrpcObject;

      const serviceMeta = pkgMeta[config.SERVICE_NAME] as any;

      const serviceDef: grpc.ServiceDefinition<any> = serviceMeta.service;
      this.server.addService(serviceDef, {
        [config.METHOD_NAME]: this.setupGrpcCall(ctor, methodName),
      });
    }
  }
  /**
   * @method setupGrpcCall
   * @author Miroslav Bajtos
   * @author Jonathan Casarrubias
   * @license MIT
   * @param prototype
   * @param methodName
   */
  private setupGrpcCall<T>(
    ctor: ControllerClass,
    methodName: string,
  ): grpc.handleUnaryCall<grpc.ServerUnaryCall<any>, any> {
    const context: Context = this;
    return function(
      call: grpc.ServerUnaryCall<any>,
      callback: (err: any, value?: T) => void,
    ) {
      handleUnary().then(
        result => callback(null, result),
        error => {
          debugger;
          callback(error);
        },
      );
      async function handleUnary(): Promise<T> {
        context.bind(GrpcBindings.CONTEXT).to(context);
        context
          .bind(GrpcBindings.GRPC_CONTROLLER)
          .toClass(ctor)
          .inScope(BindingScope.SINGLETON);
        context.bind(GrpcBindings.GRPC_METHOD_NAME).to(methodName);
        const sequence = await context.get(GrpcBindings.GRPC_SEQUENCE);
        return sequence.unaryCall(call);
      }
    };
  }
}
