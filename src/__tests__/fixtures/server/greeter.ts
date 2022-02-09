/* eslint-disable */
import {FileDescriptorProto} from 'ts-proto-descriptors';
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {
  UntypedServiceImplementation,
  handleUnaryCall,
  handleClientStreamingCall,
  handleServerStreamingCall,
  handleBidiStreamingCall,
} from '@grpc/grpc-js';

export const protobufPackage = 'greeterpackage';

/** The request message containing the user's name. */
export interface TestRequest {
  name: string;
}

/** The response message containing the greetings */
export interface TestResponse {
  message: string;
}

function createBaseTestRequest(): TestRequest {
  return {name: ''};
}

export const TestRequest = {
  encode(
    message: TestRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TestRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTestRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TestRequest {
    return {
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: TestRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TestRequest>, I>>(
    object: I,
  ): TestRequest {
    const message = createBaseTestRequest();
    message.name = object.name ?? '';
    return message;
  },
};

function createBaseTestResponse(): TestResponse {
  return {message: ''};
}

export const TestResponse = {
  encode(
    message: TestResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.message !== '') {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TestResponse {
    return {
      message: isSet(object.message) ? String(object.message) : '',
    };
  },

  toJSON(message: TestResponse): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TestResponse>, I>>(
    object: I,
  ): TestResponse {
    const message = createBaseTestResponse();
    message.message = object.message ?? '';
    return message;
  },
};

export const GreeterService = {
  /** Sends a greeting */
  unaryTest: {
    path: '/greeterpackage.Greeter/UnaryTest',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TestRequest) =>
      Buffer.from(TestRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TestRequest.decode(value),
    responseSerialize: (value: TestResponse) =>
      Buffer.from(TestResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TestResponse.decode(value),
  },
  clientStreamTest: {
    path: '/greeterpackage.Greeter/ClientStreamTest',
    requestStream: true,
    responseStream: false,
    requestSerialize: (value: TestRequest) =>
      Buffer.from(TestRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TestRequest.decode(value),
    responseSerialize: (value: TestResponse) =>
      Buffer.from(TestResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TestResponse.decode(value),
  },
  serverStreamTest: {
    path: '/greeterpackage.Greeter/ServerStreamTest',
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: TestRequest) =>
      Buffer.from(TestRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TestRequest.decode(value),
    responseSerialize: (value: TestResponse) =>
      Buffer.from(TestResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TestResponse.decode(value),
  },
  bidiStreamTest: {
    path: '/greeterpackage.Greeter/BidiStreamTest',
    requestStream: true,
    responseStream: true,
    requestSerialize: (value: TestRequest) =>
      Buffer.from(TestRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TestRequest.decode(value),
    responseSerialize: (value: TestResponse) =>
      Buffer.from(TestResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TestResponse.decode(value),
  },
} as const;

export interface GreeterServer extends UntypedServiceImplementation {
  /** Sends a greeting */
  unaryTest: handleUnaryCall<TestRequest, TestResponse>;
  clientStreamTest: handleClientStreamingCall<TestRequest, TestResponse>;
  serverStreamTest: handleServerStreamingCall<TestRequest, TestResponse>;
  bidiStreamTest: handleBidiStreamingCall<TestRequest, TestResponse>;
}

export interface ProtoMetadata {
  fileDescriptor: FileDescriptorProto;
  references: {[key: string]: any};
  dependencies?: ProtoMetadata[];
}

export const protoMetadata: ProtoMetadata = {
  fileDescriptor: FileDescriptorProto.fromPartial({
    dependency: [],
    publicDependency: [],
    weakDependency: [],
    messageType: [
      {
        field: [{name: 'name', number: 1, label: 1, type: 9, jsonName: 'name'}],
        extension: [],
        nestedType: [],
        enumType: [],
        extensionRange: [],
        oneofDecl: [],
        reservedRange: [],
        reservedName: [],
        name: 'TestRequest',
      },
      {
        field: [
          {name: 'message', number: 1, label: 1, type: 9, jsonName: 'message'},
        ],
        extension: [],
        nestedType: [],
        enumType: [],
        extensionRange: [],
        oneofDecl: [],
        reservedRange: [],
        reservedName: [],
        name: 'TestResponse',
      },
    ],
    enumType: [],
    service: [
      {
        method: [
          {
            name: 'UnaryTest',
            inputType: '.greeterpackage.TestRequest',
            outputType: '.greeterpackage.TestResponse',
            options: {uninterpretedOption: []},
          },
          {
            name: 'ClientStreamTest',
            inputType: '.greeterpackage.TestRequest',
            outputType: '.greeterpackage.TestResponse',
            options: {uninterpretedOption: []},
            clientStreaming: true,
          },
          {
            name: 'ServerStreamTest',
            inputType: '.greeterpackage.TestRequest',
            outputType: '.greeterpackage.TestResponse',
            options: {uninterpretedOption: []},
            serverStreaming: true,
          },
          {
            name: 'BidiStreamTest',
            inputType: '.greeterpackage.TestRequest',
            outputType: '.greeterpackage.TestResponse',
            options: {uninterpretedOption: []},
            clientStreaming: true,
            serverStreaming: true,
          },
        ],
        name: 'Greeter',
      },
    ],
    extension: [],
    name: 'greeter.proto',
    package: 'greeterpackage',
    sourceCodeInfo: {
      location: [
        {
          path: [6, 0, 2, 0],
          span: [5, 2, 55],
          leadingDetachedComments: [],
          leadingComments: ' Sends a greeting\n',
        },
        {
          path: [4, 0],
          span: [12, 0, 14, 1],
          leadingDetachedComments: [],
          leadingComments: " The request message containing the user's name.\n",
        },
        {
          path: [4, 1],
          span: [17, 0, 19, 1],
          leadingDetachedComments: [],
          leadingComments: ' The response message containing the greetings\n',
        },
      ],
    },
    syntax: 'proto3',
  }),
  references: {
    '.greeterpackage.TestRequest': TestRequest,
    '.greeterpackage.TestResponse': TestResponse,
  },
  dependencies: [],
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {[K in keyof T]?: DeepPartial<T[K]>}
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P &
      {[K in keyof P]: Exact<P[K], I[K]>} &
      Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
