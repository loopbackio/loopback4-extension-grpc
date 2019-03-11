import {execSync} from 'child_process';
import * as glob from 'glob';
import * as grpc from 'grpc';
import {GrpcObject} from 'grpc';
import * as path from 'path';
import {GrpcService} from './types';
/**
 * @class GrpcGenerator
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC TypeScript generator.
 * This class will iterate over a directory generating
 * corresponding typescript files from proto files.
 * Required for @grpc configuration and strict development.
 */
export class GrpcGenerator {
  /**
   * @property {[name: string]: GrpcObject} protos
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description proto instances directory loaded during
   * boot time and later being used by implemented grpc
   * controllers.
   */
  private protos: {[name: string]: GrpcObject} = {};
  /**
   * @method constructor
   * @param config
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description
   * Receives generator configurations
   */
  constructor(protected config: GrpcService) {}
  /**
   * @method execute
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will find and load all protos
   * contained within the project directory. Saving in memory
   * instances for those found protos for later usage.
   */
  public execute(): void {
    this.getProtoPaths().forEach((protoPath: string) => {
      const protoName: string = protoPath.split('/').pop() || '';
      this.protos[protoName] = this.loadProto(protoPath);
      this.generate(protoPath);
    });
  }
  /**
   * @method getProto
   * @param {string} name
   * @returns {GrpcObject}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will return a proto instance
   * from the proto list directory, previously loaded during
   * boot time.
   */
  public getProto(name: string): GrpcObject {
    return this.protos[name];
  }
  /**
   * @method loadProto
   * @param {string} protoPath
   * @returns {GrpcObject}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method receive a proto file path and
   * load that proto using the official grpc library.
   */
  public loadProto(protoPath: string): GrpcObject {
    const proto: GrpcObject = grpc.load(protoPath);
    return proto;
  }
  /**
   * @method getProtoPaths
   * @returns {string[]}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will getProtoPaths a directory look ahead and
   * typescript files generations from found proto files.
   */
  public getProtoPaths(): string[] {
    const pattern = this.config.protoPattern || '**/*.proto';
    const ignores = this.config.protoIngores || ['**/node_modules/**'];
    const options = {
      cwd: this.config.cwd || process.cwd(),
      ignore: ignores,
      nodir: true,
    };
    return glob.sync(pattern, options);
  }

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
  private generate(proto: string): Buffer {
    const root = path.dirname(proto);
    return execSync(
      `${path.join(
        __dirname,
        '../', // Root of grpc module and not the dist dir
        'compilers',
        process.platform,
        'bin',
        'protoc',
      )} --plugin=protoc-gen-ts=${path.join(
        process.cwd(),
        'node_modules',
        '.bin',
        'protoc-gen-ts',
      )} --ts_out service=true:${root} -I ${root} ${proto}`,
    );
  }
}
