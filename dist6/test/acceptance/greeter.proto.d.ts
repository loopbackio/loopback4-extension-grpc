export declare namespace Greeter {
    /**
     * @interface Greeter.Service
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Greeter interface that provides types
     * for methods from the given gRPC Greeter Service.
     */
    interface Service {
        /**
         * @method Greeter.Service.sayHello
         * @author Jonathan Casarrubias <t: johncasarrubias>
         * @license MIT
         * @description Greeter method declaration
         * from the given gRPC Greeter service.
         */
        sayHello(request: HelloRequest): HelloReply;
    }
    /**
     * @namespace Greeter.SayHello
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Greeter method configuration
     * from the given gRPC Greeter service.
     */
    namespace SayHello {
        const PROTO_NAME: string;
        const PROTO_PACKAGE: string;
        const SERVICE_NAME: string;
        const METHOD_NAME: string;
        const REQUEST_STREAM: boolean;
        const RESPONSE_STREAM: boolean;
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
