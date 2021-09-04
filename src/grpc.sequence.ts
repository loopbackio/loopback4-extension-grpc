// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/context';
import {
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
} from '@grpc/grpc-js';
import {GrpcBindings} from './keys';

import debugFactory from 'debug';
import BaseController from './grpc.controller';
import {
  handleSyncOrAsyncBidiStreamingCall,
  handleSyncOrAsyncClientStreamingCall,
  handleSyncOrAsyncServerStreamingCall,
  handleSyncOrAsyncUnaryCall,
} from './types';
const debug = debugFactory('loopback:grpc:calls');

/**
 * Interface that describes a gRPC Sequence
 */
export interface GrpcSequenceInterface {
  /**
   * Call controller method to handle server streaming call
   * The controller method should never have anything
   * executed after callback call
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  unaryCall<GrpcRequest, GrpcResponse>(
    call: ServerUnaryCall<GrpcRequest, GrpcResponse>,
  ): Promise<GrpcResponse>;

  /**
   * Call controller method to handle client streaming call
   * The controller method should never have anything
   * executed after callback call
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  clientStreamingCall<GrpcRequest, GrpcResponse>(
    call: ServerReadableStream<GrpcRequest, GrpcResponse>,
  ): Promise<GrpcResponse>;

  /**
   * Call controller method to handle server streaming call
   * The controller method promise should resolve
   * when all call.write have been executed
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  serverStreamingCall<GrpcRequest, GrpcResponse>(
    call: ServerWritableStream<GrpcRequest, GrpcResponse>,
  ): Promise<void>;

  /**
   * Call controller method to handle bidirectional streaming call
   * The controller method promise should resolve
   * when all call.write have been executed
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  bidiStreamingCall<GrpcRequest, GrpcResponse>(
    call: ServerDuplexStream<GrpcRequest, GrpcResponse>,
  ): Promise<void>;
}

/**
 * gRPC Sequence
 */
export class GrpcSequence implements GrpcSequenceInterface {
  constructor(
    @inject(GrpcBindings.GRPC_CONTROLLER)
    protected controller: BaseController,
    @inject(GrpcBindings.GRPC_METHOD_NAME) protected method: string,
  ) {}

  /**
   * Call controller method to handle unary call
   * The controller method should never have anything
   * executed after callback call
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  unaryCall<GrpcRequest, GrpcResponse>(
    call: ServerUnaryCall<GrpcRequest, GrpcResponse>,
  ): Promise<GrpcResponse> {
    debug(
      'Calling %s.%s',
      this.controller.constructor.name,
      this.method,
      call.request,
    );
    return new Promise<GrpcResponse>((resolve, reject) => {
      const c = (
        this.controller[this.method] as handleSyncOrAsyncUnaryCall<
          GrpcRequest,
          GrpcResponse
        >
      )(call, (err, value) => {
        if (err || !value) {
          reject(err);
          return;
        }
        resolve(value);
      });
      if (c) c.catch((e) => reject(e));
    });
  }

  /**
   * Call controller method to handle client streaming call
   * The controller method should never have anything
   * executed after callback call
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  clientStreamingCall<GrpcRequest, GrpcResponse>(
    call: ServerReadableStream<GrpcRequest, GrpcResponse>,
  ): Promise<GrpcResponse> {
    debug('Calling %s.%s', this.controller.constructor.name, this.method);
    return new Promise<GrpcResponse>((resolve, reject) => {
      const c = (
        this.controller[this.method] as handleSyncOrAsyncClientStreamingCall<
          GrpcRequest,
          GrpcResponse
        >
      )(call, (err, value) => {
        if (err || !value) {
          reject(err);
          return;
        }
        resolve(value);
      });
      if (c) c.catch((e) => reject(e));
    });
  }

  /**
   * Call controller method to handle server streaming call
   * The controller method promise should resolve
   * when all call.write have been executed
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  async serverStreamingCall<GrpcRequest, GrpcResponse>(
    call: ServerWritableStream<GrpcRequest, GrpcResponse>,
  ): Promise<void> {
    debug(
      'Calling %s.%s',
      this.controller.constructor.name,
      this.method,
      call.request,
    );
    await (
      this.controller[this.method] as handleSyncOrAsyncServerStreamingCall<
        GrpcRequest,
        GrpcResponse
      >
    )(call);
  }

  /**
   * Call controller method to handle bidirectional streaming call
   * The controller method promise should resolve
   * when all call.write have been executed
   * If the method throws, the error is catched in grpc.server
   * and send as an error through gRPC protocol
   * @param call
   * @returns
   */
  async bidiStreamingCall<GrpcRequest, GrpcResponse>(
    call: ServerDuplexStream<GrpcRequest, GrpcResponse>,
  ): Promise<void> {
    debug('Calling %s.%s', this.controller.constructor.name, this.method);
    await (
      this.controller[this.method] as handleSyncOrAsyncBidiStreamingCall<
        GrpcRequest,
        GrpcResponse
      >
    )(call);
  }
}
