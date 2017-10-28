// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {CoreBindings} from '@loopback/core';
/**
 * Binding keys used by this component.
 */
export namespace GrpcBindings {
  export const GRPC_SERVER = 'grpc.server';
  export const PROTO_PROVIDER = 'grpc.proto.provider';
  export const CONFIG = `${CoreBindings.APPLICATION_CONFIG}#grpc`;
  export const PORT = 'grpc.port';
  export const HANDLER = 'grpc.handler';
}
