import {inject} from '@loopback/context';
import {GrpcBindings} from './keys';
import {UnaryCall, UnaryReply} from './types';
/**
 * @interface GrpcSequenceInterface
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Interface that describes a GRPC Sequence
 */
export interface GrpcSequenceInterface {
  unaryCall(request: UnaryCall): Promise<UnaryReply>;
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

  async unaryCall(call: UnaryCall): Promise<UnaryReply> {
    // Do something before call
    const reply = await this.method(call.request);
    // Do something after call
    return reply;
  }
}
