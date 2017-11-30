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
export declare class GrpcSequence implements GrpcSequenceInterface {
    protected context: any;
    protected method: any;
    constructor(context: any, method: any);
    unaryCall(call: grpc.ServerUnaryCall): Promise<any>;
}
