"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const core_1 = require("@loopback/core");
/**
 * Binding keys used by this component.
 */
var GrpcBindings;
(function (GrpcBindings) {
    GrpcBindings.GRPC_SERVER = 'grpc.server';
    GrpcBindings.GRPC_SEQUENCE = 'grpc.sequence';
    GrpcBindings.GRPC_CONTROLLER = 'grpc.controller';
    GrpcBindings.GRPC_METHOD = 'grpc.method';
    GrpcBindings.GRPC_METHOD_NAME = 'grpc.method.name';
    GrpcBindings.GRPC_GENERATOR = 'grpc.generator';
    GrpcBindings.CONTEXT = 'grpc.context';
    GrpcBindings.HOST = 'grpc.host';
    GrpcBindings.PORT = 'grpc.port';
    GrpcBindings.CONFIG = `${core_1.CoreBindings.APPLICATION_CONFIG}#grpc`;
    GrpcBindings.LB_GRPC_HANDLER = 'loopback:grpc-service:handler';
})(GrpcBindings = exports.GrpcBindings || (exports.GrpcBindings = {}));
//# sourceMappingURL=keys.js.map