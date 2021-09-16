// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
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
import {GeneratorProvider} from './providers/generator.provider';
import {GrpcComponentConfig} from './types';
/**
 * Grpc Component for LoopBack 4.
 */
export class GrpcComponent implements Component {
  /**
   * Export GrpcProviders
   */
  providers: ProviderMap = {
    [GrpcBindings.GRPC_SERVER.toString()]: ServerProvider,
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
    @inject(GrpcBindings.CONFIG) config: GrpcComponentConfig,
  ) {
    // Set default configuration for this component
    const serverConfig: GrpcComponentConfig['server'] = Object.assign(
      {
        host: '0.0.0.0',
        port: 3000,
      },
      config.server ?? {},
    );

    // Bind host, port, proto path, package and sequence
    app.bind(GrpcBindings.HOST).to(serverConfig.host);
    app.bind(GrpcBindings.PORT).to(serverConfig.port);

    app
      .bind(GrpcBindings.GRPC_SEQUENCE)
      .toClass(config.sequence ?? GrpcSequence);
  }
}
