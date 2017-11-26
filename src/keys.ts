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
  export const GRPC_SEQUENCE = 'grpc.sequence';
  export const GRPC_CONTROLLER = 'grpc.controller';
  export const GRPC_METHOD = 'grpc.method';
  export const GRPC_METHOD_NAME = 'grpc.method.name';
  export const GRPC_GENERATOR = 'grpc.generator';
  export const CONTEXT = 'grpc.context';
  export const HOST = 'grpc.host';
  export const PORT = 'grpc.port';
  export const CONFIG = `${CoreBindings.APPLICATION_CONFIG}#grpc`;
  export const LB_GRPC_HANDLER = 'loopback:grpc-service:handler';
}
