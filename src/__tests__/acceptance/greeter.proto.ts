// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export namespace Greeter {
  /**
   * Greeter interface that provides types
   * for methods from the given gRPC Greeter Service.
   */
  export interface Service {
    /**
     * Greeter method declaration
     * from the given gRPC Greeter service.
     */
    sayHello(request: HelloRequest): HelloReply;
  }
  /**
   * Greeter method configuration
   * from the given gRPC Greeter service.
   */
  export namespace SayHello {
    export const PROTO_NAME = 'greeter.proto';
    export const PROTO_PACKAGE = 'greeterpackage';
    export const SERVICE_NAME = 'Greeter';
    export const METHOD_NAME = 'SayHello';
    export const REQUEST_STREAM = false;
    export const RESPONSE_STREAM = false;
  }
}
/**
 * @interface HelloRequest
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description HelloRequest interface that provides properties
 * and typings from the given gRPC HelloRequest Message.
 */
export interface HelloRequest {
  name: string;
}
/**
 * @interface HelloReply
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description HelloReply interface that provides properties
 * and typings from the given gRPC HelloReply Message.
 */
export interface HelloReply {
  message: string;
}
