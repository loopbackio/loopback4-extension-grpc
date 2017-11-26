// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {
  Component,
  ProviderMap,
  Server,
  CoreBindings,
  Application,
} from '@loopback/core';
import {inject, Constructor} from '@loopback/context';
import {GrpcBindings} from './keys';
import {ServerProvider} from './providers/server.provider';
import {GrpcServer} from './grpc.server';
import {GrpcSequence} from './grpc.sequence';
import {Config} from './types';
import {GeneratorProvider} from './providers/generator.provider';
/**
 * @class Grpc Component
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Grpc Component for LoopBack 4.
 */
export class GrpcComponent implements Component {
  /**
   * Export GrpcProviders
   */
  providers: ProviderMap = {
    [GrpcBindings.GRPC_SERVER]: ServerProvider,
    [GrpcBindings.GRPC_GENERATOR]: GeneratorProvider,
  };
  /**
   * Export Grpc Server
   */
  servers: {[name: string]: Constructor<Server>} = {
    GrpcServer,
  };

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
    @inject(GrpcBindings.CONFIG) config: Config.Component,
  ) {
    // Set default configuration for this component
    config = Object.assign({}, config, {
      host: '127.0.0.1',
      port: 3000,
    });
    // Bind host, port, proto path, package and sequence
    app.bind(GrpcBindings.HOST).to(config.host);
    app.bind(GrpcBindings.PORT).to(config.port);
    if (config.sequence) {
      app.bind(GrpcBindings.GRPC_SEQUENCE).toClass(config.sequence);
    } else {
      app.bind(GrpcBindings.GRPC_SEQUENCE).toClass(GrpcSequence);
    }
  }
}
