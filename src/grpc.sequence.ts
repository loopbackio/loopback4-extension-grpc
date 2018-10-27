import {inject, Context} from '@loopback/context';
import {GrpcBindings} from './keys';
import * as grpc from 'grpc';
/**
 * @interface GrpcSequenceInterface
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Interface that describes a GRPC Sequence
 */
export interface GrpcSequenceInterface {
  // tslint:disable-next-line:no-any
  unaryCall(request: grpc.ServerUnaryCall<any>): Promise<any>;
}
/**
 * @class GrpcSequence
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC Sequence
 */
export class GrpcSequence implements GrpcSequenceInterface {
  constructor(
    @inject(GrpcBindings.GRPC_CONTROLLER)
    protected controller: {[method: string]: Function},
    @inject(GrpcBindings.GRPC_METHOD_NAME) protected method: string,
  ) {}

  // tslint:disable-next-line:no-any
  async unaryCall(call: grpc.ServerUnaryCall<any>): Promise<any> {
    // Do something before call
    const reply = await this.controller[this.method](call.request);
    // Do something after call
    return reply;
  }

  // tslint:disable-next-line:no-any
  async clientStreamingCall(clientStream: grpc.ServerReadableStream<any>): Promise<any> {
    const reply = await this.controller[this.method](clientStream);
    return reply;
  }

  // tslint:disable-next-line:no-any
  processServerStream(stream: grpc.ServerWriteableStream<any>): void {
    this.controller[this.method](stream);
  }

  // tslint:disable-next-line:no-any
  processBidiStream(stream: grpc.ServerDuplexStream<any, any>): void {
    this.controller[this.method](stream);
  }
}
