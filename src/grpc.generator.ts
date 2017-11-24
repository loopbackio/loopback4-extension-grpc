import {GrpcConfig} from './types';
import {execSync} from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
/**
 * @class GrpcGenerator
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC TypeScript generator.
 * This class will iterate over a directory generating
 * typescript files from proto files.
 * Required for @grpc configuration and declaration of types.
 */
export class GrpcGenerator {
  /**
   * @method constructor
   * @param config
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description
   * Receives generator configurations
   */
  constructor(protected config: GrpcConfig) {}
  /**
   * @method walk
   * @param dir
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will walk through a directory
   */
  private walk(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file: string) => {
      file = dir + '/' + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) results = results.concat(this.walk(file));
      else results.push(file);
    });
    return results;
  }
  /**
   * @method execute
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will execute a directory look ahead and
   * typescript files generations from found proto files.
   */
  public execute(): void {
    this.walk(this.config.cwd || process.cwd())
      .filter((file: string) => {
        // TODO: Implement directory exeptions (jonathan-casarrubias)
        return file.match(/.proto$/) && !file.match(/node_modules/);
      })
      .forEach((proto: string) => this.generate(proto));
  }
  /**
   * @method generate
   * @param proto
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will generate a typescript
   * declaration and servide files from a given .proto file path
   */
  private generate(proto: string): Buffer {
    const root = path.dirname(proto);
    return execSync(
      `${path.join(
        __dirname,
        '../',
        '../', // Root of grpc module and not the dist dir
        'compilers',
        process.platform,
        'bin',
        'protoc',
      )} --plugin=protoc-gen-ts=${path.join(
        //        process.cwd(),
        //        'node_modules',
        //        '.bin',
        '/Volumes/BACKUP/development/@mean-expert/ts-protoc-gen/bin',
        'protoc-gen-ts',
      )} --ts_out service=true:${root} -I ${root} ${proto}`,
    );
  }
}
