// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {FileDescriptorProto} from 'ts-proto-descriptors';

import {MethodDecoratorFactory} from '@loopback/metadata';
import {GrpcMethodMetadata} from '../types';
import {MethodDefinition} from '@grpc/proto-loader';

import {
  handleAsyncBidiStreamingCall,
  handleAsyncClientStreamingCall,
  handleAsyncServerStreamingCall,
  handleAsyncUnaryCall,
} from '../types';

export const GRPC_METHODS = 'grpc:methods';

/**
 * This decorator provides a way to configure gRPC Micro Services within LoopBack 4
 * @param params
 *
 * @example
 *
 * myproject/controllers/greeter.controller.ts
 * myproject/protos/greeter.proto
 * myproject/protos-ts/greeter.ts
 *
 * Note: greeter.ts is automatically generated from
 * greeter.proto
 *
 * ```ts
 * import {
 *   TestRequest,
 *   TestResponse,
 *   Greeter,
 *   protoMetadata,
 * } from '../protos-ts/greeter';
 *
 * class GreeterCtrl implements Greeter {
 *   // Tell LoopBack that this is a Service RPC implementation
 *   @grpc(protoMetadata.fileDescriptor)
 *   async unaryTest(request: TestRequest): Promise<TestResponse> {
 *     return {
 *       message: 'Hello ' + request.name,
 *     };
 *   }
 * }
 * ```
 */
export function grpc(spec: GrpcMethodMetadata) {
  return function <
    GrpcRequest,
    GrpcResponse,
    AsyncUnaryCall extends handleAsyncUnaryCall<GrpcRequest, GrpcResponse>,
    AsyncClientStreamingCall extends handleAsyncClientStreamingCall<
      GrpcRequest,
      GrpcResponse
    >,
    AsyncServerStreamingCall extends handleAsyncServerStreamingCall<
      GrpcRequest,
      GrpcResponse
    >,
    AsyncBidiStreamingCall extends handleAsyncBidiStreamingCall<
      GrpcRequest,
      GrpcResponse
    >,
    T extends
      | TypedPropertyDescriptor<AsyncUnaryCall>
      | TypedPropertyDescriptor<AsyncClientStreamingCall>
      | TypedPropertyDescriptor<AsyncServerStreamingCall>
      | TypedPropertyDescriptor<AsyncBidiStreamingCall>,
  >(
    target: Object,
    propertyKey: string | symbol,
    descriptor: T extends TypedPropertyDescriptor<infer F>
      ? F extends AsyncUnaryCall
        ? TypedPropertyDescriptor<
            handleAsyncUnaryCall<GrpcRequest, GrpcResponse>
          >
        : F extends AsyncClientStreamingCall
        ? TypedPropertyDescriptor<
            handleAsyncClientStreamingCall<GrpcRequest, GrpcResponse>
          >
        : F extends AsyncServerStreamingCall
        ? TypedPropertyDescriptor<
            handleAsyncServerStreamingCall<GrpcRequest, GrpcResponse>
          >
        : TypedPropertyDescriptor<
            handleAsyncBidiStreamingCall<GrpcRequest, GrpcResponse>
          >
      : T,
  ):
    | (T extends TypedPropertyDescriptor<infer F>
        ? F extends AsyncUnaryCall
          ? TypedPropertyDescriptor<
              handleAsyncUnaryCall<GrpcRequest, GrpcResponse>
            >
          : F extends AsyncClientStreamingCall
          ? TypedPropertyDescriptor<
              handleAsyncClientStreamingCall<GrpcRequest, GrpcResponse>
            >
          : F extends AsyncServerStreamingCall
          ? TypedPropertyDescriptor<
              handleAsyncServerStreamingCall<GrpcRequest, GrpcResponse>
            >
          : TypedPropertyDescriptor<
              handleAsyncBidiStreamingCall<GrpcRequest, GrpcResponse>
            >
        : T)
    | void {
    if (!descriptor.value) return;

    const decorator = MethodDecoratorFactory.createDecorator(
      GRPC_METHODS,
      spec,
    );
    return decorator(
      target,
      propertyKey,
      descriptor as TypedPropertyDescriptor<
        | handleAsyncUnaryCall<GrpcRequest, GrpcResponse>
        | handleAsyncClientStreamingCall<GrpcRequest, GrpcResponse>
        | handleAsyncServerStreamingCall<GrpcRequest, GrpcResponse>
        | handleAsyncBidiStreamingCall<GrpcRequest, GrpcResponse>
      >,
    ) as T extends TypedPropertyDescriptor<infer F>
      ? F extends AsyncUnaryCall
        ? TypedPropertyDescriptor<
            handleAsyncUnaryCall<GrpcRequest, GrpcResponse>
          >
        : F extends AsyncClientStreamingCall
        ? TypedPropertyDescriptor<
            handleAsyncClientStreamingCall<GrpcRequest, GrpcResponse>
          >
        : F extends AsyncServerStreamingCall
        ? TypedPropertyDescriptor<
            handleAsyncServerStreamingCall<GrpcRequest, GrpcResponse>
          >
        : TypedPropertyDescriptor<
            handleAsyncBidiStreamingCall<GrpcRequest, GrpcResponse>
          >
      : T;
  };
}

export function getServiceNameAndMethodNameFromPath(path: string): {
  METHOD_NAME: string;
  SERVICE_NAME: string;
} {
  const splittedPath = path.split('.');
  const splittedServiceAndMethod =
    splittedPath[splittedPath.length - 1].split('/');
  return {
    METHOD_NAME: splittedServiceAndMethod[1],
    SERVICE_NAME: splittedServiceAndMethod[0],
  };
}

export function getSpecsFromMethodDefinitionAndProtoMetadata(
  methodDefinition: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MethodDefinition<any, any>,
    'originalName' | 'requestType' | 'responseType'
  >,
  fileDescriptor: FileDescriptorProto,
): GrpcMethodMetadata {
  return {
    ...getServiceNameAndMethodNameFromPath(methodDefinition.path),
    REQUEST_STREAM: methodDefinition.requestStream,
    RESPONSE_STREAM: methodDefinition.responseStream,
    PROTO_NAME: fileDescriptor.name,
    PROTO_PACKAGE: fileDescriptor.package,
  };
}
