// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Provider, inject} from '@loopback/context';
import {grpc, gRPCServerFn} from '../types';
import {GrpcBindings} from '../keys';
import {GrpcServerConfig} from "../grpc.server";
// Require gRPC Module
const grpc = require('grpc');
/**
 * @class ProtoProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return the GRPC Server
 */
export class ProtoProvider implements Provider<gRPCServerFn> {
  private proto;
  constructor(@inject(GrpcBindings.CONFIG) config: GrpcServerConfig) {
    this.proto = grpc.load(config.proto)[config.package];
  }
  public value() { return () => this.proto; }
}
