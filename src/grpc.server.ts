import { Application, CoreBindings, Server } from '@loopback/core';
import { Context, Reflector, inject } from '@loopback/context';
import { GrpcBindings } from "./";
import { grpc } from "./types";
import * as gRPC from 'grpc'; // Actual GRPC Module
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
        @inject(GrpcBindings.CONFIG) protected config: GrpcServerConfig,
        @inject(GrpcBindings.PROTO_PROVIDER) protected proto: any,
    ) {
        super(app);
        // Can't check falsiness, 0 is a valid port.
        if (config.port === null || config.port === undefined) {
            config.port = 3000;
        }
        this.bind(GrpcBindings.PORT).to(config.port);
        this._setup();
    }

    async start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.bind(
                `${this.config.host || '0.0.0.0'}:${this.config.port || 3000}`,
                gRPC.ServerCredentials.createInsecure(),
              );
            this.server.start();
            resolve();
        });
    }

    async stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // TODO: Implement stop
            resolve();
        });
    }

    private _setup() {
        for (const b of this.find('controllers.*')) {
            const controllerName = b.key.replace(/^controllers\./, '');
            const ctor = b.valueConstructor;
            if (!ctor) {
                throw new Error(
                    `The controller ${controllerName} was not bound via .toClass()`,
                );
            }
            for (
                let proto = ctor.prototype;
                proto && proto !== Object.prototype;
                proto = Object.getPrototypeOf(proto)
            ) {
                this._setupControllerMethods(proto);
            }
        }
    }

    private _setupControllerMethods(prototype: Function) {
        const handlers: {[key: string]: Function} = {};
        const className = prototype.constructor.name || '<UnknownClass>';
        const controllerMethods = Object.getOwnPropertyNames(prototype).filter(
            key => key !== 'constructor' && typeof prototype[key] === 'function',
        );
        for (const methodName of controllerMethods) {
            const fullName  = `${className}.${methodName}`; 
            const enabled: boolean = Reflector.getMetadata(
                'loopback:grpc-service',
                prototype,
                methodName,
            );
            if (!enabled) {
                debug(`  skipping ${fullName} - grpc is not enabled`);
            }
            // TODO Verify if this is right
            handlers[methodName] = prototype[methodName];
        }
        // Add GRPC Service
        this.server.addService(this.proto[className].service, handlers);
    }
}
/**
 * Valid configuration for the GrpcServer constructor.
 *
 * @export
 * @interface GrpcServerConfig
 */
export interface GrpcServerConfig {
    host?: string;
    port?: number;
    proto: string;
    package: string;
}  