// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, Provider} from '@loopback/context';
import {GrpcGenerator} from '../grpc.generator';
import {GrpcBindings} from '../keys';
import {GrpcComponentConfig} from '../types';
/**
 * This provider will return a gRPC TypeScript Generator
 * This can be used to generate typescript files and service declarations
 * from proto files on run time.
 */
export class GeneratorProvider implements Provider<GrpcGenerator> {
  private generator: GrpcGenerator;
  constructor(
    @inject(GrpcBindings.CONFIG) protected config: GrpcComponentConfig,
  ) {
    this.generator = new GrpcGenerator(config.compilerOptions);
  }
  public value(): GrpcGenerator {
    return this.generator;
  }
}
