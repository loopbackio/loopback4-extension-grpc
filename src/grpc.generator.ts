// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {execSync} from 'child_process';
import * as glob from 'glob';
import * as path from 'path';
import {GrpcComponentConfig} from './types';
import {GrpcObject, loadPackageDefinition} from '@grpc/grpc-js';
import {loadSync} from '@grpc/proto-loader';

import debugFactory from 'debug';
const debug = debugFactory('loopback:grpc:generator');

/**
 * gRPC TypeScript generator.
 * This class will iterate over a directory generating
 * corresponding typescript files from proto files.
 * Required for `@grpc` configuration and strict development.
 */
export class GrpcGenerator {
  /**
   * proto instances directory loaded during
   * boot time and later being used by implemented gRPC
   * controllers.
   */
  private protos: {[name: string]: GrpcObject} = {};

  /**
   * @param - config
   */
  constructor(
    protected readonly config: GrpcComponentConfig['compilerOptions'],
  ) {}

  /**
   * This method will find and load all protos
   * contained within the project directory. Saving in memory
   * instances for those found protos for later usage.
   */
  public execute(): void {
    this.getProtoPaths().forEach((protoPath: string) => {
      const cwd = process.cwd();
      const absoluteProtoFilePath = path.join(cwd, protoPath);
      const includeDirs = this.getIncludeDirsFromProtoPath(
        absoluteProtoFilePath,
      );
      if (this.config?.load !== false) {
        const protoName: string =
          includeDirs === path.dirname(absoluteProtoFilePath)
            ? path.basename(absoluteProtoFilePath) ?? ''
            : path.relative(includeDirs, absoluteProtoFilePath);
        this.protos[protoName] = this.loadProto(
          absoluteProtoFilePath,
          includeDirs,
        );
      }
      if (this.config?.generate)
        this.generate(absoluteProtoFilePath, includeDirs);
    });
  }

  /**
   * This method will return a proto instance
   * from the proto list directory, previously loaded during
   * boot time.
   *
   * @param name
   */
  public getProto(name: string): GrpcObject {
    return this.protos[name];
  }

  /**
   * This method receive a proto file path and
   * load that proto using the official grpc library.
   *
   * @param absoluteProtoPath
   * @param includeDirs
   */
  public loadProto(absoluteProtoPath: string, includeDirs: string): GrpcObject {
    debug(
      'Loading proto at %s with includeDirs',
      absoluteProtoPath,
      includeDirs,
    );
    const proto: GrpcObject = loadPackageDefinition(
      loadSync(absoluteProtoPath, {
        includeDirs: [includeDirs],
      }),
    );
    return proto;
  }

  /**
   * This method will getProtoPaths a directory look ahead and
   * typescript files generations from found proto files.
   */
  public getProtoPaths(): string[] {
    const pattern = this.config?.protoPattern ?? '**/*.proto';
    const ignores = this.config?.protoIgnores ?? ['**/node_modules/**'];
    const options = {
      cwd: this.config?.cwd ?? process.cwd(),
      ignore: ignores,
      nodir: true,
    };
    return glob.sync(pattern, options);
  }

  /**
   * This method will generate a typescript
   * file representing the provided proto file by calling
   * google's proto compiler and using `ts-proto` plugin.
   * https://github.com/stephenh/ts-proto
   * @param absoluteProtoPath
   * @param includeDirs
   */
  private generate(absoluteProtoPath: string, includeDirs: string): Buffer {
    debug(
      'Generate TS file from proto at %s with includeDirs',
      absoluteProtoPath,
      includeDirs,
    );
    const cwd = this.config?.cwd ?? process.cwd();
    const isWin = ['win32', 'win64'].includes(process.platform);
    return execSync(
      `${path.join(
        __dirname,
        '../', // Root of grpc module and not the dist dir
        'compilers',
        process.platform,
        'bin',
        `protoc${isWin ? '.exe' : ''}`,
      )} --plugin=${path.join(
        cwd,
        'node_modules',
        'ts-proto',
        `protoc-gen-ts_proto`,
      )} --ts_proto_out=${this.getOutputPathFromProtoPath(
        absoluteProtoPath,
      )} --ts_proto_opt=${
        this.config?.tsOutOptions ??
        'outputServices=grpc-js,outputClientImpl=false,lowerCaseServiceMethods=true,esModuleInterop=true,useDate=false,outputSchema=true,env=node'
      } ${absoluteProtoPath} -I ${includeDirs} ${
        this.config?.additionalArgs ?? ''
      }`,
    );
  }

  private getIncludeDirsFromProtoPath(absoluteProtoPath: string) {
    let includeDirs = path.dirname(absoluteProtoPath);
    if (this.config?.protoPath) {
      includeDirs =
        typeof this.config?.protoPath === 'string'
          ? this.config?.protoPath
          : this.config?.protoPath(absoluteProtoPath);
    }
    return includeDirs;
  }

  private getOutputPathFromProtoPath(absoluteProtoPath: string) {
    let outputPath = path.dirname(absoluteProtoPath);
    if (this.config?.tsOutputPath) {
      outputPath =
        typeof this.config?.tsOutputPath === 'string'
          ? this.config?.tsOutputPath
          : this.config?.tsOutputPath(absoluteProtoPath);
    }
    return outputPath;
  }
}
