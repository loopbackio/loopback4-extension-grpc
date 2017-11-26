import {Application, CoreBindings, Server} from '@loopback/core';
import {Context, inject, Reflector} from '@loopback/context';
import {GrpcBindings} from './keys';
import {GrpcSequence} from './grpc.sequence';
import {Config} from './types';
import * as grpc from 'grpc';
import {GrpcGenerator} from './grpc.generator';
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
      this._setupControllerMethods(ctor.prototype);
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

  private _setupControllerMethods(prototype: Function) {
    const className = prototype.constructor.name || '<UnknownClass>';
    const controllerMethods = Object.getOwnPropertyNames(prototype).filter(
      key => key !== 'constructor' && typeof prototype[key] === 'function',
    );

    let config: Config.Method;
    for (const methodName of controllerMethods) {
      const fullName = `${className}.${methodName}`;
      const _config: Config.Method = Reflector.getMetadata(
        GrpcBindings.LB_GRPC_HANDLER,
        prototype,
        methodName,
      );
      if (!_config) {
        return debug(`  skipping ${fullName} - grpc is not enabled`);
      }
      config = _config;
      const proto: grpc.GrpcObject = this.generator.getProto(config.PROTO_NAME);
      if (!proto) {
        throw new Error(`Grpc Server: No proto file was provided.`);
      }
      this.server.addService(
        proto[config.PROTO_PACKAGE][config.SERVICE_NAME].service,
        {
          [config.METHOD_NAME]: this.setupGrpcCall(prototype, methodName),
        },
      );
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
  private setupGrpcCall(prototype, methodName: string): grpc.handleUnaryCall {
    const context: Context = this;
    return function(
      call: grpc.ServerUnaryCall,
      callback: (err, value?) => void,
    ) {
      handleUnary().then(
        result => callback(null, result),
        error => {
          debugger;
          callback(error);
        },
      );
      async function handleUnary(): Promise<any> {
        context.bind(GrpcBindings.CONTEXT).to(context);
        context.bind(GrpcBindings.GRPC_METHOD).to(prototype[methodName]);
        const sequence: GrpcSequence = await context.get(
          GrpcBindings.GRPC_SEQUENCE,
        );
        return sequence.unaryCall(call);
      }
    };
  }
}
