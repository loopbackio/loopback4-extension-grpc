"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Greeter;
(function (Greeter) {
    /**
     * @namespace Greeter.SayHello
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Greeter method configuration
     * from the given gRPC Greeter service.
     */
    let SayHello;
    (function (SayHello) {
        SayHello.PROTO_NAME = 'greeter.proto';
        SayHello.PROTO_PACKAGE = 'greeterpackage';
        SayHello.SERVICE_NAME = 'Greeter';
        SayHello.METHOD_NAME = 'SayHello';
        SayHello.REQUEST_STREAM = false;
        SayHello.RESPONSE_STREAM = false;
    })(SayHello = Greeter.SayHello || (Greeter.SayHello = {}));
})(Greeter = exports.Greeter || (exports.Greeter = {}));
//# sourceMappingURL=greeter.proto.js.map