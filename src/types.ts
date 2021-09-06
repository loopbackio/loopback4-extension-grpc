// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Constructor} from '@loopback/context';
import {
  handleBidiStreamingCall,
  handleClientStreamingCall,
  handleServerStreamingCall,
  handleUnaryCall,
  sendUnaryData,
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
} from '@grpc/grpc-js';
import {GrpcSequenceInterface} from './grpc.sequence';

export interface GrpcComponentConfig {
  server?: {
    /**
     * Defines gRPC server host address
     * Defaults to 127.0.0.1
     */
    host?: string;
    /**
     * Defines gRPC server port
     * Defaults to 3000
     */
    port?: number;
    /**
     * Configure TLS server side
     */
    tls?: {
      /**
       * Root CA path
       */
      rootCertPath: string;
      /**
       * Pairs of key and certificate paths
       */
      keyCertPairPaths: {
        privateKeyPath: string;
        certChainPath: string;
      }[];
      /**
       * Defaults to false
       */
      checkClientCertificate?: boolean;
    };
  };
  /**
   * Specify your own sequence to handle gRPC calls
   */
  sequence?: Constructor<GrpcSequenceInterface>;
  compilerOptions?: {
    /**
     * Overrides process.cwd
     */
    cwd?: string;
    /**
     * glob pattern for proto files, default to `**\/*.proto`
     */
    protoPattern?: string;
    /**
     * An array of glob patterns to ignore for proto files,
     * default to ['**\/node_modules\/**]
     */
    protoIgnores?: string[];
    /**
     * Defaults to parent directory
     * You can specify an absolute path or a function that returns an absolut epath from the file path
     */
    tsOutputPath?: string | ((path: string) => string);
    /**
     * Defaults to "outputServices=grpc-js,outputClientImpl=false,lowerCaseServiceMethods=true,esModuleInterop=true,useDate=false,outputSchema=true,env=node"
     * See https://github.com/stephenh/ts-proto
     */
    tsOutOptions?: string;
    /**
     * Defaults to parent directory of proto file
     * You can specify an absolute path or a function that returns an absolute path from the file path
     * This is also used to load protos
     */
    protoPath?: string | ((path: string) => string);
    /**
     * Additional args for the compiler
     * ie: --experimental_allow_proto3_optional
     */
    additionalArgs?: string;
    /**
     * Generates .ts files from proto
     * Defaults to false
     */
    generate?: true;
    /**
     * Loads .ts files from proto in GrpcGenerator memory
     * Defaults to true
     */
    load?: false;
  };
}

export interface BaseGrpcMethodMetadata {
  PROTO_NAME: string;
  PROTO_PACKAGE: string;
  SERVICE_NAME: string;
  METHOD_NAME: string;
  REQUEST_STREAM: boolean;
  RESPONSE_STREAM: boolean;
}

export interface GrpcUnaryMethodMetadata extends BaseGrpcMethodMetadata {
  REQUEST_STREAM: false;
  RESPONSE_STREAM: false;
}

export interface GrpcServerStreamingMethodMetadata
  extends BaseGrpcMethodMetadata {
  REQUEST_STREAM: false;
  RESPONSE_STREAM: true;
}

export interface GrpcClientStreamingMethodMetadata
  extends BaseGrpcMethodMetadata {
  REQUEST_STREAM: true;
  RESPONSE_STREAM: false;
}

export interface GrpcBidiStreamingMethodMetadata
  extends BaseGrpcMethodMetadata {
  REQUEST_STREAM: true;
  RESPONSE_STREAM: true;
}

export type GrpcMethodMetadata =
  | GrpcUnaryMethodMetadata
  | GrpcServerStreamingMethodMetadata
  | GrpcClientStreamingMethodMetadata
  | GrpcBidiStreamingMethodMetadata;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleAsyncUnaryCall<GrpcRequest, GrpcResponse> = (
  call: ServerUnaryCall<GrpcRequest, GrpcResponse>,
  callback: sendUnaryData<GrpcResponse>,
) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleAsyncClientStreamingCall<GrpcRequest, GrpcResponse> = (
  call: ServerReadableStream<GrpcRequest, GrpcResponse>,
  callback: sendUnaryData<GrpcResponse>,
) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleAsyncServerStreamingCall<GrpcRequest, GrpcResponse> = (
  call: ServerWritableStream<GrpcRequest, GrpcResponse>,
) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleAsyncBidiStreamingCall<GrpcRequest, GrpcResponse> = (
  call: ServerDuplexStream<GrpcRequest, GrpcResponse>,
) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleSyncOrAsyncUnaryCall<GrpcRequest, GrpcResponse> =
  | handleUnaryCall<GrpcRequest, GrpcResponse>
  | handleAsyncUnaryCall<GrpcRequest, GrpcResponse>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleSyncOrAsyncClientStreamingCall<GrpcRequest, GrpcResponse> =
  | handleClientStreamingCall<GrpcRequest, GrpcResponse>
  | handleAsyncClientStreamingCall<GrpcRequest, GrpcResponse>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleSyncOrAsyncServerStreamingCall<GrpcRequest, GrpcResponse> =
  | handleServerStreamingCall<GrpcRequest, GrpcResponse>
  | handleAsyncServerStreamingCall<GrpcRequest, GrpcResponse>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type handleSyncOrAsyncBidiStreamingCall<GrpcRequest, GrpcResponse> =
  | handleBidiStreamingCall<GrpcRequest, GrpcResponse>
  | handleAsyncBidiStreamingCall<GrpcRequest, GrpcResponse>;
