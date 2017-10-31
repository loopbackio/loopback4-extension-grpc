// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { Reflector } from '@loopback/context';
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
 *   @rpc
 *   public sayHello(call, callback) {
 *      callback(null, {message: 'Hello ' + call.request.name});
 *   }
 * } 
 */
export function rpc() {
  return function (target: object, propertyKey: string) {
    Reflector.defineMetadata(
      'loopback:grpc-service',
      true, // enabled
      target,
      propertyKey,
    );
  }
}
