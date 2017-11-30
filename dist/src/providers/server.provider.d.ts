import { Provider } from '@loopback/context';
import * as grpc from 'grpc';
/**
 * @class ServerProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return the GRPC Server
 */
export declare class ServerProvider implements Provider<grpc.Server> {
    private server;
    value(): grpc.Server;
}
