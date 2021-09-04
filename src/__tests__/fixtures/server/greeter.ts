/* eslint-disable */
import {FileDescriptorProto} from 'ts-proto-descriptors';
import Long from 'long';
import {
  makeGenericClientConstructor,
  ChannelCredentials,
  ChannelOptions,
  UntypedServiceImplementation,
  handleUnaryCall,
  handleClientStreamingCall,
  handleServerStreamingCall,
  handleBidiStreamingCall,
  Client,
  ClientUnaryCall,
  Metadata,
  CallOptions,
  ClientWritableStream,
  ClientReadableStream,
  ClientDuplexStream,
  ServiceError,
} from '@grpc/grpc-js';
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'greeterpackage';

/** The request message containing the user's name. */
export interface TestRequest {
  name: string;
}

/** The response message containing the greetings */
export interface TestResponse {
  message: string;
}

const baseTestRequest: object = {name: ''};

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
    const message = {...baseTestRequest} as TestRequest;
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
    const message = {...baseTestRequest} as TestRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    return message;
  },

  toJSON(message: TestRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial(object: DeepPartial<TestRequest>): TestRequest {
    const message = {...baseTestRequest} as TestRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    return message;
  },
};

const baseTestResponse: object = {message: ''};

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
    const message = {...baseTestResponse} as TestResponse;
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
    const message = {...baseTestResponse} as TestResponse;
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    } else {
      message.message = '';
    }
    return message;
  },

  toJSON(message: TestResponse): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial(object: DeepPartial<TestResponse>): TestResponse {
    const message = {...baseTestResponse} as TestResponse;
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    } else {
      message.message = '';
    }
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

export interface GreeterClient extends Client {
  /** Sends a greeting */
  unaryTest(
    request: TestRequest,
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientUnaryCall;
  unaryTest(
    request: TestRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientUnaryCall;
  unaryTest(
    request: TestRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientUnaryCall;
  clientStreamTest(
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientWritableStream<TestRequest>;
  clientStreamTest(
    metadata: Metadata,
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientWritableStream<TestRequest>;
  clientStreamTest(
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientWritableStream<TestRequest>;
  clientStreamTest(
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TestResponse) => void,
  ): ClientWritableStream<TestRequest>;
  serverStreamTest(
    request: TestRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TestResponse>;
  serverStreamTest(
    request: TestRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<TestResponse>;
  bidiStreamTest(): ClientDuplexStream<TestRequest, TestResponse>;
  bidiStreamTest(
    options: Partial<CallOptions>,
  ): ClientDuplexStream<TestRequest, TestResponse>;
  bidiStreamTest(
    metadata: Metadata,
    options?: Partial<CallOptions>,
  ): ClientDuplexStream<TestRequest, TestResponse>;
}

export const GreeterClient = makeGenericClientConstructor(
  GreeterService,
  'greeterpackage.Greeter',
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>,
  ): GreeterClient;
};

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
