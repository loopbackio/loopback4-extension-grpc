// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Types and interfaces exposed by the extension go here
export interface GrpcServerInstance {
  addService: (service: string, handlers: {[key: string]: Function}) => void;
  addProtoService: (
    service: string,
    handlers: {[key: string]: Function},
  ) => void;
  bind: (host: string, secure: boolean) => void;
  start: (callback?: () => void) => void;
  tryShutdown: (callback?: () => void) => void;
  forceShutdown: (callback?: () => void) => void;
  register: () => void;
}
export interface UnaryCall {
  request: UnaryCall;
}
export interface UnaryRequest {}
export interface UnaryReply {}
export interface GrpcConfig {
  host?: string;
  port?: number;
  proto: string;
  package: string;
  sequence?: any;
}
