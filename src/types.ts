import {Constructor} from '@loopback/context';
import {GrpcSequenceInterface} from './grpc.sequence';

// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Types and interfaces exposed by the extension go here
export namespace Config {
  export interface Component {
    cwd?: string;
    /**
     * glob pattern for proto files, default to `**\/*proto`
     */
    protoPattern?: string;
    /**
     * An array of glob patterns to ignore for proto files,
     * default to ['**\/node_modules\/**]
     */
    protoIngores?: string[];
    host?: string;
    port?: number;
    sequence?: Constructor<GrpcSequenceInterface>;
  }
  export interface Method {
    PROTO_NAME: string;
    PROTO_PACKAGE: string;
    SERVICE_NAME: string;
    METHOD_NAME: string;
    REQUEST_STREAM: boolean;
    RESPONSE_STREAM: boolean;
  }
}
