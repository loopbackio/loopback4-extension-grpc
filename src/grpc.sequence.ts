import {inject} from '@loopback/context';
import {GrpcBindings} from './keys';
import * as grpc from 'grpc';
/**
 * @interface GrpcSequenceInterface
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Interface that describes a GRPC Sequence
 */
export interface GrpcSequenceInterface {
  unaryCall(request: grpc.ServerUnaryCall): Promise<any>;
}
/**
 * @class GrpcSequence
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC Sequence
 */
export class GrpcSequence implements GrpcSequenceInterface {
  constructor(
    @inject(GrpcBindings.CONTEXT) protected context,
    @inject(GrpcBindings.GRPC_METHOD) protected method,
  ) {}

  async unaryCall(call: grpc.ServerUnaryCall): Promise<any> {
    // Do something before call
    const reply = await this.method(call.request);
    // Do something after call
    return reply;
  }
}
