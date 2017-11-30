import { Application, Server } from '@loopback/core';
import { Context } from '@loopback/context';
import * as grpc from 'grpc';
import { GrpcGenerator } from './grpc.generator';
/**
 * @class GrpcServer
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description
 * This Class provides a LoopBack Server implementing GRPC
 */
export declare class GrpcServer extends Context implements Server {
    protected app: Application;
    protected server: grpc.Server;
    protected host: string;
    protected port: string;
    protected generator: GrpcGenerator;
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
    constructor(app: Application, server: grpc.Server, host: string, port: string, generator: GrpcGenerator);
    start(): Promise<void>;
    stop(): Promise<void>;
    private _setupControllerMethods(prototype);
    /**
     * @method setupGrpcCall
     * @author Miroslav Bajtos
     * @author Jonathan Casarrubias
     * @license MIT
     * @param prototype
     * @param methodName
     */
    private setupGrpcCall(prototype, methodName);
}
