// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Types and interfaces exposed by the extension go here
export namespace grpc {
  export interface Server {
    addService: (
      service: string,
      handlers: {[key: string]: Function},
    ) => void;
    addProtoService: (
      service: string,
      handlers: {[key: string]: Function},
    ) => void;
    bind: (host: string, secure: boolean) => void;
    start: () => void;
  }
}

export type gRPCServerFn = () => grpc.Server;
