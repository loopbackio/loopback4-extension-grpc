import {Config} from './types';
import {execSync} from 'child_process';
import * as grpc from 'grpc';
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
  private protos: {[name: string]: grpc.GrpcObject} = {};
  /**
   * @method constructor
   * @param config
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description
   * Receives generator configurations
   */
  constructor(protected config: Config.Component) {}
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
    this.getProtoPaths().forEach((protoPath: string) => {
      const protoName: string = protoPath.split('/').pop() || '';
      this.protos[protoName] = this.loadProto(protoPath);
      this.generate(protoPath);
    });
  }
  /**
   * @method getProto
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will getProto declaration used to load
   * this service to the grpc server.
   */
  public getProto(name: string): grpc.GrpcObject {
    return this.protos[name];
  }
  /**
   * @method loadProto
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will loadProto declaration used to load
   * this service to the grpc server.
   */
  public loadProto(protoPath: string): grpc.GrpcObject {
    const proto: grpc.GrpcObject = grpc.load(protoPath);
    return proto;
  }
  /**
   * @method getProtoPaths
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will getProtoPaths a directory look ahead and
   * typescript files generations from found proto files.
   */
  public getProtoPaths(): string[] {
    return this.walk(this.config.cwd || process.cwd()).filter(
      (file: string) => {
        // TODO: Implement directory exeptions (jonathan-casarrubias)
        return file.match(/.proto$/) && !file.match(/node_modules/);
      },
    );
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
        process.cwd(),
        'node_modules',
        '.bin',
        'protoc-gen-ts',
      )} --ts_out service=true:${root} -I ${root} ${proto}`,
    );
  }
}
