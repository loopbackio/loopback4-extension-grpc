"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
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
function grpc(config) {
    return function (target, propertyKey) {
        context_1.Reflector.defineMetadata(keys_1.GrpcBindings.LB_GRPC_HANDLER, config, target, propertyKey);
    };
}
exports.grpc = grpc;
//# sourceMappingURL=grpc.decorator.js.map