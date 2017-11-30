"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
/**
 * @class ServerProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return the GRPC Server
 */
class ServerProvider {
    constructor() {
        this.server = new grpc.Server();
    }
    value() {
        return this.server;
    }
}
exports.ServerProvider = ServerProvider;
//# sourceMappingURL=server.provider.js.map