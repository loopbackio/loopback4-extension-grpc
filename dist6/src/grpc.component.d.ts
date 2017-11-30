import { Component, ProviderMap, Server, Application } from '@loopback/core';
import { Constructor } from '@loopback/context';
import { Config } from './types';
/**
 * @class Grpc Component
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Grpc Component for LoopBack 4.
 */
export declare class GrpcComponent implements Component {
    /**
     * Export GrpcProviders
     */
    providers: ProviderMap;
    /**
     * Export Grpc Server
     */
    servers: {
        [name: string]: Constructor<Server>;
    };
    constructor(app: Application, config: Config.Component);
}
