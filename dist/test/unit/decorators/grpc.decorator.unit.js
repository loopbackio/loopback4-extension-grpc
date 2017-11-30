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
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const keys_1 = require("../../../src/keys");
const greeter_proto_1 = require("../../acceptance/greeter.proto");
const context_1 = require("@loopback/context");
describe('@rpc decorator', () => {
    it('defines reflection metadata for rpc method', () => {
        class GreeterCtrl {
            sayHello(request) {
                return { message: `hello ${request.name}` };
            }
            Helper() {
                return true;
            }
        }
        __decorate([
            __1.grpc(greeter_proto_1.Greeter.SayHello),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", Object)
        ], GreeterCtrl.prototype, "sayHello", null);
        const flags = {};
        const proto = GreeterCtrl.prototype;
        const controllerMethods = Object.getOwnPropertyNames(proto).filter(key => key !== 'constructor' && typeof proto[key] === 'function');
        for (const methodName of controllerMethods) {
            const config = context_1.Reflector.getMetadata(keys_1.GrpcBindings.LB_GRPC_HANDLER, proto, methodName);
            if (config)
                flags[methodName] = true;
        }
        testlab_1.expect(flags).to.deepEqual({ sayHello: true });
    });
});
//# sourceMappingURL=grpc.decorator.unit.js.map