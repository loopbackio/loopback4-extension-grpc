import {inject} from '@loopback/context';
import {GrpcBindings} from './keys';
import {ServerUnaryCall} from 'grpc';
/**
 * @interface GrpcSequenceInterface
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Interface that describes a GRPC Sequence
 */
export interface GrpcSequenceInterface {
  unaryCall(request: ServerUnaryCall): Promise<any>;
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
  // At this point we can not know the type of the returned promise.
  // Promise<Type> would be possible on custom sequences created
  // by the developers at app level. (Jonathan Casarrubias)
  async unaryCall(call: ServerUnaryCall): Promise<any> {
    return await this.method(call.request);
  }
}
