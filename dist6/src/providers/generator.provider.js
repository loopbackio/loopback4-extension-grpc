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
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const context_1 = require("@loopback/context");
const grpc_generator_1 = require("../grpc.generator");
const keys_1 = require("../keys");
/**
 * @class GeneratorProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return a GRPC TypeScript Generator
 * This can be used to generate typescript files and service declarations
 * from proto files on run time.
 */
let GeneratorProvider = class GeneratorProvider {
    constructor(config) {
        this.config = config;
        this.generator = new grpc_generator_1.GrpcGenerator(config);
    }
    value() {
        return this.generator;
    }
};
GeneratorProvider = __decorate([
    __param(0, context_1.inject(keys_1.GrpcBindings.CONFIG)),
    __metadata("design:paramtypes", [Object])
], GeneratorProvider);
exports.GeneratorProvider = GeneratorProvider;
//# sourceMappingURL=generator.provider.js.map