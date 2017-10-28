// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Reflector} from '@loopback/context';
import {GrpcBindings} from '../keys';
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
 * myproject/controllers/Greeter.ts
 * 
 * class Greeter {
 *   @grpc
 *   public sayHello(call, callback) {
 *      callback(null, {message: 'Hello ' + call.request.name});
 *   }
 * } 
 */
export function grpc() {
  return function(target: object, propertyKey: string) {
    Reflector.defineMetadata(
      GrpcBindings.LB_GRPC_HANDLER,
      true,
      target,
      propertyKey,
    );
  };
}
