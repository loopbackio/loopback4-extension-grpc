/* eslint-disable */
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

export const GreeterClient = (makeGenericClientConstructor(
  GreeterService,
  'greeterpackage.Greeter',
) as unknown) as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>,
  ): GreeterClient;
  service: typeof GreeterService;
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
