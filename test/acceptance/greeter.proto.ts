export namespace Greeter {
  /**
   * @interface Greeter.Service
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Greeter interface that provides types
   * for methods from the given gRPC Greeter Service.
   */
  export interface Service {
    sayHello(request: HelloRequest): HelloReply;
  }
  /**
   * @interface Greeter.HelloRequest
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description HelloRequest interface that provides properties
   * and typings from the given gRPC HelloRequest Message.
   */
  export interface HelloRequest {
    name: string;
  }
  /**
   * @interface Greeter.HelloReply
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description HelloReply interface that provides properties
   * and typings from the given gRPC HelloReply Message.
   */
  export interface HelloReply {
    message: string;
  }
  /**
   * @namespace Config
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Config namespace that provides configurations
    * for methods from the given gRPC Greeter Service.
   */
  export namespace Config {
    export namespace SayHello {
      export const PROTO_NAME: string = 'greeter.proto';
      export const PROTO_PACKAGE: string = 'greeterpackage';
      export const SERVICE_NAME: string = 'Greeter';
      export const METHOD_NAME: string = 'SayHello';
      export const REQUEST_STREAM: boolean = false;
      export const RESPONSE_STREAM: boolean = false;
    }
  }
}
