// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {MethodDecoratorFactory} from '@loopback/metadata';
import {GrpcMethod} from '../types';

export const GRPC_METHODS = 'grpc:methods';

/**
 * @function gRPCService
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @param params
 * @license MIT
 * @description This decorator provides a way to
 * configure GRPC Micro Services within LoopBack 4
 *
 * Example of usage:
 *
 * myproject/controllers/greeter/Greeter.ts
 * myproject/controllers/greeter/greeter.proto
 * myproject/controllers/greeter/greeter.proto.ts
 *
 * Note: greeter.proto.ts is automatically generated from
 * greeter.proto
 *
 * import {Greeter, HelloRequest, HelloReply} from 'greeter.proto';
 *
 * class GreeterCtrl implements Greeter.Service {
 *   @grpc(Greeter.SayHello)
 *   public sayHello(request: HelloRequest): HelloResponse {
 *     return { message: 'Hello ' + call.request.name };
 *   }
 * }
 */
export function grpc(spec: GrpcMethod) {
  return MethodDecoratorFactory.createDecorator(GRPC_METHODS, spec);
}
