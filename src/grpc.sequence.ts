import {inject} from '@loopback/context';
import {ServerUnaryCall} from 'grpc';
import {GrpcBindings} from './keys';
/**
 * @interface GrpcSequenceInterface
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Interface that describes a GRPC Sequence
 */
export interface GrpcSequenceInterface {
  // tslint:disable-next-line:no-any
  unaryCall(request: ServerUnaryCall<any>): Promise<any>;
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
  async unaryCall(call: ServerUnaryCall<any>): Promise<any> {
    // Do something before call
    const reply = await this.controller[this.method](call.request);
    // Do something after call
    return reply;
  }
}
