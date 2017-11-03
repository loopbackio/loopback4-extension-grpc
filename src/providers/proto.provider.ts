// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {GrpcBindings} from '../keys';
// Require gRPC Module
const grpc = require('grpc');
/**
 * @class ProtoProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return the GRPC Server
 */
export class ProtoProvider {
  private proto;
  constructor(
    @inject(GrpcBindings.PROTO_FILE) path: string,
    @inject(GrpcBindings.PROTO_PKG) pkg: string,
  ) {
    if (!path || !pkg) {
      throw new Error(
        `Unable to load proto.file, missing proto file path and package`,
      );
    }
    this.proto = grpc.load(path)[pkg];
  }
  public value() {
    return () => this.proto;
  }
}
