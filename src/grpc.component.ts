// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Component, ProviderMap, Server} from '@loopback/core';
import {Constructor} from '@loopback/context';
import {GrpcBindings} from './keys';
import {ProtoProvider} from "./providers/proto.provider";
import {ServerProvider} from "./providers/server.provider";
import {GrpcServer} from "./grpc.server";
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
   [GrpcBindings.PROTO_PROVIDER]: ProtoProvider
  };
  /**
   * Export Grpc Server
   */
  servers: { [name: string]: Constructor<Server> } = {
    GrpcServer
  };
}
