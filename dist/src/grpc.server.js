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
const core_1 = require("@loopback/core");
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
const grpc = require("grpc");
const grpc_generator_1 = require("./grpc.generator");
const debug = require('debug')('loopback:grpc:server');
/**
 * @class GrpcServer
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description
 * This Class provides a LoopBack Server implementing GRPC
 */
let GrpcServer = class GrpcServer extends context_1.Context {
    /**
     * @memberof GrpcServer
     * Creates an instance of GrpcServer.
     *
     * @param {Application} app The application instance (injected via
     * CoreBindings.APPLICATION_INSTANCE).
     * @param {grpc.Server} server The actual GRPC Server module (injected via
     * GrpcBindings.GRPC_SERVER).
     * @param {GRPCServerConfig=} options The configuration options (injected via
     * GRPCBindings.CONFIG).
     *
     */
    constructor(app, server, host, port, generator) {
        super(app);
        this.app = app;
        this.server = server;
        this.host = host;
        this.port = port;
        this.generator = generator;
        // Execute TypeScript Generator. (Must be first one to load)
        this.generator.execute();
        // Setup Controllers
        for (const b of this.find('controllers.*')) {
            const controllerName = b.key.replace(/^controllers\./, '');
            const ctor = b.valueConstructor;
            if (!ctor) {
                throw new Error(`The controller ${controllerName} was not bound via .toClass()`);
            }
            this._setupControllerMethods(ctor.prototype);
        }
    }
    async start() {
        return new Promise((resolve, reject) => {
            this.server.bind(`${this.host}:${this.port}`, grpc.ServerCredentials.createInsecure());
            this.server.start();
            resolve();
        });
    }
    async stop() {
        return new Promise((resolve, reject) => {
            this.server.forceShutdown();
            resolve();
        });
    }
    _setupControllerMethods(prototype) {
        const className = prototype.constructor.name || '<UnknownClass>';
        const controllerMethods = Object.getOwnPropertyNames(prototype).filter(key => key !== 'constructor' && typeof prototype[key] === 'function');
        let config;
        for (const methodName of controllerMethods) {
            const fullName = `${className}.${methodName}`;
            const _config = context_1.Reflector.getMetadata(keys_1.GrpcBindings.LB_GRPC_HANDLER, prototype, methodName);
            if (!_config) {
                return debug(`  skipping ${fullName} - grpc is not enabled`);
            }
            config = _config;
            const proto = this.generator.getProto(config.PROTO_NAME);
            if (!proto) {
                throw new Error(`Grpc Server: No proto file was provided.`);
            }
            this.server.addService(proto[config.PROTO_PACKAGE][config.SERVICE_NAME].service, {
                [config.METHOD_NAME]: this.setupGrpcCall(prototype, methodName),
            });
        }
    }
    /**
     * @method setupGrpcCall
     * @author Miroslav Bajtos
     * @author Jonathan Casarrubias
     * @license MIT
     * @param prototype
     * @param methodName
     */
    setupGrpcCall(prototype, methodName) {
        const context = this;
        return function (call, callback) {
            handleUnary().then(result => callback(null, result), error => {
                debugger;
                callback(error);
            });
            async function handleUnary() {
                context.bind(keys_1.GrpcBindings.CONTEXT).to(context);
                context.bind(keys_1.GrpcBindings.GRPC_METHOD).to(prototype[methodName]);
                const sequence = await context.get(keys_1.GrpcBindings.GRPC_SEQUENCE);
                return sequence.unaryCall(call);
            }
        };
    }
};
GrpcServer = __decorate([
    __param(0, context_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, context_1.inject(keys_1.GrpcBindings.GRPC_SERVER)),
    __param(2, context_1.inject(keys_1.GrpcBindings.HOST)),
    __param(3, context_1.inject(keys_1.GrpcBindings.PORT)),
    __param(4, context_1.inject(keys_1.GrpcBindings.GRPC_GENERATOR)),
    __metadata("design:paramtypes", [core_1.Application, grpc.Server, String, String, grpc_generator_1.GrpcGenerator])
], GrpcServer);
exports.GrpcServer = GrpcServer;
//# sourceMappingURL=grpc.server.js.map