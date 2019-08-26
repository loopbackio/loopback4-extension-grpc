export namespace Greeter {
  /**
   * @interface Greeter.Service
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Greeter interface that provides types
   * for methods from the given gRPC Greeter Service.
   */
  export interface Service {
    /**
     * @method Greeter.Service.sayHello
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Greeter method declaration
     * from the given gRPC Greeter service.
     */
    sayHello(request: HelloRequest): HelloReply;
    /**
     * @method Greeter.Service.sayTest
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Greeter method declaration
     * from the given gRPC Greeter service.
     */
    sayTest(request: TestRequest): TestReply;
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
  /**
   * @namespace Greeter.SayTest
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description Greeter method configuration
   * from the given gRPC Greeter service.
   */
  export namespace SayTest {
    export const PROTO_NAME: string = 'greeter.proto';
    export const PROTO_PACKAGE: string = 'greeterpackage';
    export const SERVICE_NAME: string = 'Greeter';
    export const METHOD_NAME: string = 'SayTest';
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
/**
 * @interface TestRequest
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description TestRequest interface that provides properties
 * and typings from the given gRPC TestRequest Message.
 */
export interface TestRequest {
  name: string;
}
/**
 * @interface TestReply
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description TestReply interface that provides properties
 * and typings from the given gRPC TestReply Message.
 */
export interface TestReply {
  message: string;
}
