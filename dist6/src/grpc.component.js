"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const core_1 = require("@loopback/core");
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
const server_provider_1 = require("./providers/server.provider");
const grpc_server_1 = require("./grpc.server");
const grpc_sequence_1 = require("./grpc.sequence");
const generator_provider_1 = require("./providers/generator.provider");
/**
 * @class Grpc Component
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Grpc Component for LoopBack 4.
 */
let GrpcComponent = class GrpcComponent {
    constructor(app, config) {
        /**
         * Export GrpcProviders
         */
        this.providers = {
            [keys_1.GrpcBindings.GRPC_SERVER]: server_provider_1.ServerProvider,
            [keys_1.GrpcBindings.GRPC_GENERATOR]: generator_provider_1.GeneratorProvider,
        };
        /**
         * Export Grpc Server
         */
        this.servers = {
            GrpcServer: grpc_server_1.GrpcServer,
        };
        // Set default configuration for this component
        config = Object.assign({
            host: '127.0.0.1',
            port: 3000,
        }, config);
        // Bind host, port, proto path, package and sequence
        app.bind(keys_1.GrpcBindings.HOST).to(config.host);
        app.bind(keys_1.GrpcBindings.PORT).to(config.port);
        if (config.sequence) {
            app.bind(keys_1.GrpcBindings.GRPC_SEQUENCE).toClass(config.sequence);
        }
        else {
            app.bind(keys_1.GrpcBindings.GRPC_SEQUENCE).toClass(grpc_sequence_1.GrpcSequence);
        }
    }
};
GrpcComponent = __decorate([
    __param(0, context_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, context_1.inject(keys_1.GrpcBindings.CONFIG)),
    __metadata("design:paramtypes", [core_1.Application, Object])
], GrpcComponent);
exports.GrpcComponent = GrpcComponent;
//# sourceMappingURL=grpc.component.js.map