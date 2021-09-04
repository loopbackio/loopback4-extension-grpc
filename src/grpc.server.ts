// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, Context, inject} from '@loopback/context';
import {
  Application,
  ControllerClass,
  CoreBindings,
  Server,
} from '@loopback/core';
import {
  GrpcObject,
  handleBidiStreamingCall,
  handleClientStreamingCall,
  handleServerStreamingCall,
  handleUnaryCall,
  KeyCertPair,
  sendUnaryData,
  ServerCredentials,
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
  ServiceDefinition,
  UntypedServiceImplementation,
  Server as PkgGrpcServer,
} from '@grpc/grpc-js';
import {MetadataInspector} from '@loopback/metadata';
import {GRPC_METHODS} from './decorators/grpc.decorator';
import {GrpcGenerator} from './grpc.generator';
import {GrpcBindings} from './keys';
import {GrpcComponentConfig, GrpcMethodMetadata} from './types';
import {readFileSync} from 'fs';

import debugFactory from 'debug';
const debug = debugFactory('loopback:grpc:setup');

type HandleCall<GrpcRequest, GrpcResponse> =
  | handleUnaryCall<GrpcRequest, GrpcResponse>
  | handleServerStreamingCall<GrpcRequest, GrpcResponse>
  | handleClientStreamingCall<GrpcRequest, GrpcResponse>
  | handleBidiStreamingCall<GrpcRequest, GrpcResponse>;

type SetupGrpcCall = (
  ctor: ControllerClass,
  methodName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => HandleCall<any, any>;

/**
 * This Class provides a LoopBack Server implementing gRPC
 */
export class GrpcServer extends Context implements Server {
  private _listening = false;
  /**
   * @memberof GrpcServer
   * Creates an instance of GrpcServer.
   *
   * @param app - The application instance (injected via
   * CoreBindings.APPLICATION_INSTANCE).
   * @param server - The actual gRPC Server module (injected via
   * GrpcBindings.GRPC_SERVER).
   * @param options - The configuration options (injected via
   * GRPCBindings.CONFIG).
   *
   */
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) protected app: Application,
    @inject(GrpcBindings.GRPC_SERVER) protected server: PkgGrpcServer,
    @inject(GrpcBindings.HOST) protected readonly host: string,
    @inject(GrpcBindings.PORT) protected readonly port: string,
    @inject(GrpcBindings.GRPC_GENERATOR) protected generator: GrpcGenerator,
    @inject(GrpcBindings.CONFIG) protected readonly config: GrpcComponentConfig,
  ) {
    super(app);
    // Execute TypeScript Generator. It loads protos.
    this.generator.execute();
    // Setup Controllers
    for (const c of this.find('controllers.*')) {
      const controllerName = c.key.replace(/^controllers\./, '');
      const ctor = c.valueConstructor;
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
    let credentials: ServerCredentials;
    if (this.config.server?.tls?.keyCertPairPaths.length) {
      const rootCert = readFileSync(this.config.server.tls.rootCertPath);
      const keyCertPairs: KeyCertPair[] =
        this.config.server.tls.keyCertPairPaths.map(
          (kcpp): KeyCertPair => ({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            private_key: readFileSync(kcpp.privateKeyPath),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            cert_chain: readFileSync(kcpp.certChainPath),
          }),
        );
      credentials = ServerCredentials.createSsl(
        rootCert,
        keyCertPairs,
        this.config.server.tls.checkClientCertificate,
      );
    } else {
      credentials = ServerCredentials.createInsecure();
    }
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        `${this.host}:${this.port}`,
        credentials,
        (error) => {
          if (error) {
            reject(error);
          }
          this.server.start();
          this._listening = true;
          resolve();
        },
      );
    });
  }

  async stop(): Promise<void> {
    this.server.forceShutdown();
    this._listening = false;
  }

  private _setupControllerMethods(ctor: ControllerClass) {
    const controllerMethods =
      MetadataInspector.getAllMethodMetadata<GrpcMethodMetadata>(
        GRPC_METHODS,
        ctor.prototype,
      ) ?? {};

    const services = new Map<ServiceDefinition, UntypedServiceImplementation>();

    for (const methodName in controllerMethods) {
      const config = controllerMethods[methodName];
      debug('Config for method %s', methodName, config);

      const proto: GrpcObject = this.generator.getProto(config.PROTO_NAME);
      debug('Proto for %s', config.PROTO_NAME, proto);

      if (!proto) {
        throw new Error(`Grpc Server: No proto file was provided.`);
      }

      const splittedPkgName = config.PROTO_PACKAGE.split('.');
      let pkgMeta: GrpcObject = proto[
        splittedPkgName.shift() ?? ''
      ] as GrpcObject;
      for (const pkgName of splittedPkgName) {
        pkgMeta = pkgMeta[pkgName] as GrpcObject;
      }
      debug('Package for %s', config.PROTO_PACKAGE, pkgMeta);

      const serviceMeta = pkgMeta[config.SERVICE_NAME] as unknown as {
        service: ServiceDefinition;
      };
      debug('Service for %s', config.SERVICE_NAME, serviceMeta);

      const serviceDef: ServiceDefinition = serviceMeta.service;
      let setupMethod: {
        [K in keyof GrpcServer]: GrpcServer[K] extends SetupGrpcCall
          ? K
          : never;
      }[keyof GrpcServer] = 'setupGrpcUnaryCall';
      if (config.REQUEST_STREAM && config.RESPONSE_STREAM) {
        setupMethod = 'setupGrpcBidiStreamingCall';
      } else if (config.REQUEST_STREAM) {
        setupMethod = 'setupGrpcClientStreamingCall';
      } else if (config.RESPONSE_STREAM) {
        setupMethod = 'setupGrpcServerStreamingCall';
      }

      if (!services.has(serviceDef)) {
        services.set(serviceDef, {
          // cast needed because ts won't allow to call method
          [config.METHOD_NAME]: (this[setupMethod] as SetupGrpcCall)(
            ctor,
            methodName,
          ),
        });
      } else {
        const methods = services.get(serviceDef)!;
        methods[config.METHOD_NAME] = (this[setupMethod] as SetupGrpcCall)(
          ctor,
          methodName,
        );
      }
    }

    for (const [service, methods] of services.entries()) {
      if (debug.enabled) {
        debug('Adding service:', service, Object.keys(methods));
      }
      this.server.addService(service, methods);
    }
  }

  /**
   * Set up unary gRPC call
   * @param prototype
   * @param methodName
   */
  public setupGrpcUnaryCall<GrpcRequest, GrpcResponse>(
    ctor: ControllerClass,
    methodName: string,
  ): handleUnaryCall<GrpcRequest, GrpcResponse> {
    return (
      call: ServerUnaryCall<GrpcRequest, GrpcResponse>,
      callback: sendUnaryData<GrpcResponse>,
    ) => {
      const handleUnary = async (): Promise<GrpcResponse> => {
        this.bind(GrpcBindings.CONTEXT).to(this);
        this.bind(GrpcBindings.GRPC_CONTROLLER)
          .toClass(ctor)
          .inScope(BindingScope.SINGLETON);
        this.bind(GrpcBindings.GRPC_METHOD_NAME).to(methodName);
        const sequence = await this.get(GrpcBindings.GRPC_SEQUENCE);
        return sequence.unaryCall(call);
      };
      handleUnary().then(
        (result) => callback(null, result),
        (error) => {
          callback(error, null);
        },
      );
    };
  }

  /**
   * Set up client streaming gRPC call
   * @param prototype
   * @param methodName
   */
  public setupGrpcClientStreamingCall<GrpcRequest, GrpcResponse>(
    ctor: ControllerClass,
    methodName: string,
  ): handleClientStreamingCall<GrpcRequest, GrpcResponse> {
    return (
      call: ServerReadableStream<GrpcRequest, GrpcResponse>,
      callback: sendUnaryData<GrpcResponse>,
    ) => {
      const handleClientStreaming = async (): Promise<GrpcResponse> => {
        this.bind(GrpcBindings.CONTEXT).to(this);
        this.bind(GrpcBindings.GRPC_CONTROLLER)
          .toClass(ctor)
          .inScope(BindingScope.SINGLETON);
        this.bind(GrpcBindings.GRPC_METHOD_NAME).to(methodName);
        const sequence = await this.get(GrpcBindings.GRPC_SEQUENCE);
        return sequence.clientStreamingCall(call);
      };
      handleClientStreaming().then(
        (result) => callback(null, result),
        (error) => {
          callback(error, null);
        },
      );
    };
  }

  /**
   * Set up server streaming gRPC call
   * @param prototype
   * @param methodName
   */
  public setupGrpcServerStreamingCall<GrpcRequest, GrpcResponse>(
    ctor: ControllerClass,
    methodName: string,
  ): handleServerStreamingCall<GrpcRequest, GrpcResponse> {
    return (call: ServerWritableStream<GrpcRequest, GrpcResponse>) => {
      const handleServerStreaming = async (): Promise<void> => {
        this.bind(GrpcBindings.CONTEXT).to(this);
        this.bind(GrpcBindings.GRPC_CONTROLLER)
          .toClass(ctor)
          .inScope(BindingScope.SINGLETON);
        this.bind(GrpcBindings.GRPC_METHOD_NAME).to(methodName);
        const sequence = await this.get(GrpcBindings.GRPC_SEQUENCE);
        return sequence.serverStreamingCall(call);
      };
      handleServerStreaming()
        .catch((err) => call.emit('err', err))
        .finally(() => {
          if (call.writable) call.end();
        });
    };
  }

  /**
   * Set up bidirectional streaming gRPC call
   * @param prototype
   * @param methodName
   */
  public setupGrpcBidiStreamingCall<GrpcRequest, GrpcResponse>(
    ctor: ControllerClass,
    methodName: string,
  ): handleBidiStreamingCall<GrpcRequest, GrpcResponse> {
    return (call: ServerDuplexStream<GrpcRequest, GrpcResponse>) => {
      const handleBidi = async (): Promise<void> => {
        this.bind(GrpcBindings.CONTEXT).to(this);
        this.bind(GrpcBindings.GRPC_CONTROLLER)
          .toClass(ctor)
          .inScope(BindingScope.SINGLETON);
        this.bind(GrpcBindings.GRPC_METHOD_NAME).to(methodName);
        const sequence = await this.get(GrpcBindings.GRPC_SEQUENCE);
        return sequence.bidiStreamingCall(call);
      };
      handleBidi()
        .catch((err) => call.emit('error', err))
        .finally(() => {
          if (call.writable) call.end();
        });
    };
  }
}
