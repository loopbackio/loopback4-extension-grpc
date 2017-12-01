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
   * @property packages
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description Grpc packages directory.
   * This might be populated from different controllers but
   * registered once at boot.
   */
  private packages: {[key: string]: any} = {};
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
      this.setupControllerMethods(ctor.prototype);
    }
  }

  async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Grpc packages registration time is on
      Object.keys(this.packages).forEach((pkg: string) => {
        Object.keys(this.packages[pkg].services).forEach((service: string) => {
          //console.log('Adding Service');
          //console.log(this.packages[pkg].services[service].methods);
          this.server.addService(
            this.packages[pkg].proto[service].service,
            this.packages[pkg].services[service].methods,
          );
        });
      });
      // Start grpc server now :)
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
      this.packages = {};
      this.server.forceShutdown();
      resolve();
    });
  }

  private setupControllerMethods(prototype: Function) {
    const className = prototype.constructor.name || '<UnknownClass>';
    const controllerMethods = Object.getOwnPropertyNames(prototype).filter(
      key => key !== 'constructor' && typeof prototype[key] === 'function',
    );

    for (const methodName of controllerMethods) {
      const fullName = `${className}.${methodName}`;
      const config = Reflector.getMetadata(
        GrpcBindings.LB_GRPC_HANDLER,
        prototype,
        methodName,
      );
      if (!config) {
        return debug(`  skipping ${fullName} - grpc is not enabled`);
      }
      const proto: grpc.GrpcObject = this.generator.getProto(config.PROTO_NAME);
      if (!proto) {
        throw new Error(`Grpc Server: No proto file was provided.`);
      }
      // Verify grpc method type
      const type: string | null = this.getMethodType(config);
      if (!type)
        throw new Error(
          `Grpc Server: Invalid grpc method configuration for ${fullName}`,
        );
      // Everything good, save handler reference for further registration
      this.saveReference(config, proto, prototype, methodName, type);
    }
  }
  /**
   * @method saveReference
   * @author Jonathan Casarrubias
   * @license MIT
   * @param config
   * @param proto
   * @param prototype
   * @param methodName
   * @param type
   * @description This method will populate the packages directory, making
   * sure everything is correctly initialized and calling setupGrpcMethod
   * to get a function handler for the given method name.
   */
  private saveReference(
    config: Config.Method,
    proto: grpc.GrpcObject,
    prototype,
    methodName: string,
    type: string,
  ): void {
    // Is this package already initialized?
    if (!this.packages[config.PROTO_PACKAGE])
      this.packages[config.PROTO_PACKAGE] = {
        proto: proto[config.PROTO_PACKAGE],
        services: {},
      };
    // Is this service already initialized?
    if (!this.packages[config.PROTO_PACKAGE].services[config.SERVICE_NAME])
      this.packages[config.PROTO_PACKAGE].services[config.SERVICE_NAME] = {
        config,
        methods: {},
      };
    // Populate with current method handler for further registration
    this.packages[config.PROTO_PACKAGE].services[config.SERVICE_NAME].methods[
      config.METHOD_NAME
    ] = this.setupGrpcMethod(prototype, methodName, type);
  }
  /**
   * @method getMethodType
   * @param config
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description
   * This method will return the type of a grpc method according
   * the passed configurations.
   */
  private getMethodType(config: Config.Method): string | null {
    if (!config.REQUEST_STREAM && !config.RESPONSE_STREAM) return 'unaryCall';
    if (config.REQUEST_STREAM && !config.RESPONSE_STREAM)
      return 'readableStream';
    if (!config.REQUEST_STREAM && config.RESPONSE_STREAM)
      return 'writeableStream';
    if (config.REQUEST_STREAM && config.RESPONSE_STREAM) return 'duplexStream';
    return null;
  }
  /**
   * @method setupGrpcMethod
   * @author Miroslav Bajtos
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @param prototype
   * @param methodName
   */
  private setupGrpcMethod(
    prototype,
    methodName: string,
    type: string,
  ): grpc.handleUnaryCall {
    let method;
    switch (type) {
      case 'unaryCall':
        method = this.setupUnaryCall(prototype, methodName);
        break;
      case 'readableStream':
      case 'writeableStream':
      case 'duplexStream':
        method = this.setupStream(prototype, methodName, type);
        break;
    }
    return method;
  }

  setupUnaryCall(prototype, methodName: string): grpc.handleUnaryCall {
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

  setupStream(
    prototype,
    methodName: string,
    type: string,
  ):
    | grpc.handleClientStreamingCall
    | grpc.handleServerStreamingCall
    | grpc.handleBidiStreamingCall {
    const context: Context = this;
    return async function(
      stream:
        | grpc.ServerDuplexStream
        | grpc.ServerReadableStream
        | grpc.ServerWriteableStream,
    ) {
      context.bind(GrpcBindings.CONTEXT).to(context);
      context.bind(GrpcBindings.GRPC_METHOD).to(prototype[methodName]);
      const sequence: GrpcSequence = await context.get(
        GrpcBindings.GRPC_SEQUENCE,
      );
      sequence[type](stream);
    };
  }
}
