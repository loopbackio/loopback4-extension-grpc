import * as grpc from "grpc";
export namespace Greeter {
  /**
   * @interface Greeter.Error
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Greeter interface that provides types
    * for results with errors. This is extending from grpc ServerError.
   */
  export interface Error extends grpc.ServiceError {}
  /**
   * @interface Greeter.Interface
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Greeter interface that provides types
   * for methods from the given gRPC Greeter Service.
   */
  export interface Interface {
    /**
     * @method Greeter.Interface.sayHello
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Greeter method declaration
     * from the given gRPC Greeter service.
     */
    sayHello(request: HelloRequest): HelloReply | Greeter.Error;
  }
  /**
   * @namespace Greeter.SayHello
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Greeter method configuration
   * from the given gRPC Greeter service.
   */
  export namespace SayHello {
    export const PROTO_NAME: string = 'greeter.proto';
    export const PROTO_PACKAGE: string = 'greeterpackage';
    export const SERVICE_NAME: string = 'Greeter';
    export const METHOD_NAME: string = 'SayHello';
    export const REQUEST_STREAM: boolean = false;
    export const RESPONSE_STREAM: boolean = false;
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
