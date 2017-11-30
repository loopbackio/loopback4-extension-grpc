import { Config } from './types';
import * as grpc from 'grpc';
/**
 * @class GrpcGenerator
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC TypeScript generator.
 * This class will iterate over a directory generating
 * corresponding typescript files from proto files.
 * Required for @grpc configuration and strict development.
 */
export declare class GrpcGenerator {
    protected config: Config.Component;
    /**
     * @property {[name: string]: grpc.GrpcObject} protos
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @description proto instances directory loaded during
     * boot time and later being used by implemented grpc
     * controllers.
     */
    private protos;
    /**
     * @method constructor
     * @param config
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @description
     * Receives generator configurations
     */
    constructor(config: Config.Component);
    /**
     * @method execute
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description This method will find and load all protos
     * contained within the project directory. Saving in memory
     * instances for those found protos for later usage.
     */
    execute(): void;
    /**
     * @method getProto
     * @param {string} name
     * @returns {grpc.GrpcObject}
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description This method will return a proto instance
     * from the proto list directory, previously loaded during
     * boot time.
     */
    getProto(name: string): grpc.GrpcObject;
    /**
     * @method loadProto
     * @param {string} protoPath
     * @returns {grpc.GrpcObject}
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description This method receive a proto file path and
     * load that proto using the official grpc library.
     */
    loadProto(protoPath: string): grpc.GrpcObject;
    /**
     * @method getProtoPaths
     * @returns {string[]}
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description This method will getProtoPaths a directory look ahead and
     * typescript files generations from found proto files.
     */
    getProtoPaths(): string[];
    /**
     * @method walk
     * @param {string} dir
     * @returns {string[]}
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description This method will walk through a directory and return a list
     * of containing files.
     */
    private walk(dir);
    /**
     * @method generate
     * @param {string} proto
     * @returns {Buffer}
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description This method will generate a typescript
     * file representing the provided proto file by calling
     * google's proto compiler and using @mean-experts's
     * protoc-ts plugin.
     */
    private generate(proto);
}
