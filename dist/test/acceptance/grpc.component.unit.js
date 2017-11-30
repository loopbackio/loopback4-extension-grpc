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
const testlab_1 = require("@loopback/testlab");
const context_1 = require("@loopback/context");
const core_1 = require("@loopback/core");
//import {GrpcConfig} from '../../';
const grpc_decorator_1 = require("../../src/decorators/grpc.decorator");
const grpcModule = require("grpc");
const __1 = require("../..");
const greeter_proto_1 = require("./greeter.proto");
/**
Only run this on grpc typescript generation issues
Comment all tests to do so.
const app: Application = givenApplication();
(async () => {
  await app.start();
  await app.stop();
})();
**/
describe('GrpcComponent', () => {
    // GRPC Component Configurations
    it('defines grpc component configurations', async () => {
        const app = givenApplication();
        const lbGrpcServer = await app.getServer('GrpcServer');
        testlab_1.expect(lbGrpcServer.getSync(__1.GrpcBindings.PORT)).to.be.eql(8080);
    });
    // LoopBack GRPC Service
    it('creates a grpc service', async () => {
        // Define Greeter Service Implementation
        class GreeterCtrl {
            // Tell LoopBack that this is a Service RPC implementation
            sayHello(request) {
                return {
                    message: 'Hello ' + request.name,
                };
            }
        }
        __decorate([
            grpc_decorator_1.grpc(greeter_proto_1.Greeter.SayHello),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", Object)
        ], GreeterCtrl.prototype, "sayHello", null);
        // Load LoopBack Application
        const app = givenApplication();
        app.controller(GreeterCtrl);
        await app.start();
        // Make GRPC Client Call
        const result = await asyncCall({
            client: getGrpcClient(app),
            method: 'sayHello',
            data: { name: 'World' },
        });
        testlab_1.expect(result.message).to.eql('Hello World');
        await app.stop();
    });
    // LoopBack GRPC Service
    it('creates a grpc service with custom sequence', async () => {
        // Define Greeter Service Implementation
        class GreeterCtrl {
            // Tell LoopBack that this is a Service RPC implementation
            sayHello(request) {
                const reply = { message: 'Hello ' + request.name };
                return reply;
            }
        }
        __decorate([
            grpc_decorator_1.grpc(greeter_proto_1.Greeter.SayHello),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", Object)
        ], GreeterCtrl.prototype, "sayHello", null);
        let MySequence = class MySequence {
            constructor(context, method) {
                this.context = context;
                this.method = method;
            }
            async unaryCall(call) {
                // Do something before call
                const reply = await this.method(call.request);
                reply.message += ' Sequenced';
                // Do something after call
                return reply;
            }
        };
        MySequence = __decorate([
            __param(0, context_1.inject(__1.GrpcBindings.CONTEXT)),
            __param(1, context_1.inject(__1.GrpcBindings.GRPC_METHOD)),
            __metadata("design:paramtypes", [Object, Object])
        ], MySequence);
        // Load LoopBack Application
        const app = givenApplication(MySequence);
        app.controller(GreeterCtrl);
        await app.start();
        // Make GRPC Client Call
        const result = await asyncCall({
            client: getGrpcClient(app),
            method: 'sayHello',
            data: { name: 'World' },
        });
        testlab_1.expect(result.message).to.eql('Hello World Sequenced');
        await app.stop();
    });
});
/**
 * Returns GRPC Enabled Application
 **/
function givenApplication(sequence) {
    const grpcConfig = { port: 8080 };
    if (sequence) {
        grpcConfig.sequence = sequence;
    }
    return new core_1.Application({
        components: [__1.GrpcComponent],
        grpc: grpcConfig,
    });
}
/**
 * Returns GRPC Client
 **/
function getGrpcClient(app) {
    const proto = grpcModule.load('./test/acceptance/greeter.proto')['greeterpackage'];
    return new proto.Greeter(`${app.getSync(__1.GrpcBindings.HOST)}:${app.getSync(__1.GrpcBindings.PORT)}`, grpcModule.credentials.createInsecure());
}
/**
 * Callback to Promise Wrapper
 **/
async function asyncCall(input) {
    return new Promise((resolve, reject) => input.client[input.method](input.data, (err, response) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(response);
        }
    }));
}
//# sourceMappingURL=grpc.component.unit.js.map