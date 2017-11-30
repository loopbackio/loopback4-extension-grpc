import { Provider } from '@loopback/context';
import { GrpcGenerator } from '../grpc.generator';
import { Config } from '../types';
/**
 * @class GeneratorProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return a GRPC TypeScript Generator
 * This can be used to generate typescript files and service declarations
 * from proto files on run time.
 */
export declare class GeneratorProvider implements Provider<GrpcGenerator> {
    protected config: Config.Component;
    private generator;
    constructor(config: Config.Component);
    value(): GrpcGenerator;
}
