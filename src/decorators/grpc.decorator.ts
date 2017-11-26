// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Reflector} from '@loopback/context';
import {GrpcBindings} from '../keys';
import {Config} from '../types';
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
 * import { Greeter } from 'greeter.proto';
 *
 * class GreeterCtrl implements Greeter.Service {
 *   @grpc(Greeter.Config.SayHello)
 *   public sayHello(request: Greeter.HelloRequest): Greeter.HelloResponse {
 *     return { message: 'Hello ' + call.request.name };
 *   }
 * }
 */
export function grpc(config: Config.Method) {
  return function(target: object, propertyKey: string) {
    Reflector.defineMetadata(
      GrpcBindings.LB_GRPC_HANDLER,
      config,
      target,
      propertyKey,
    );
  };
}
