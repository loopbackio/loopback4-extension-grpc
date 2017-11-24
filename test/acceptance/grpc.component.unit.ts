// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {inject} from '@loopback/context';
import {Application} from '@loopback/core';
import {GrpcSequenceInterface, GrpcConfig} from '../../';
import {grpc} from '../../src/decorators/grpc.decorator';
import * as grpcModule from 'grpc';
import {GrpcComponent, GrpcBindings} from '../..';
import {GreeterInterface, HelloRequest, HelloReply} from '../protos/greeter_pb';

const pkg: string = 'greeterpackage';
const file: string = './test/protos/greeter.proto';

describe('GrpcComponent', () => {
  // GRPC Component Configurations
  it('defines grpc component configurations', async () => {
    const app: Application = givenApplication();
    const lbGrpcServer: any = await app.getServer('GrpcServer');
    expect(lbGrpcServer.getSync(GrpcBindings.PROTO_PKG)).to.be.eql(pkg);
    expect(lbGrpcServer.getSync(GrpcBindings.PROTO_FILE)).to.be.eql(file);
  });
  // LoopBack GRPC Service
  it('creates a grpc service', async () => {
    // Define Greeter Service Implementation
    class Greeter implements GreeterInterface {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc()
      sayHello(request: HelloRequest): HelloReply {
        const reply: HelloReply = {message: 'Hello ' + request.name};
        return reply;
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(Greeter);
    await app.start();
    // Make GRPC Client Call
    const result: HelloReply = await asyncCall({
      client: getGrpcClient(app),
      method: 'sayHello',
      data: {name: 'World'},
    });
    expect(result.message).to.eql('Hello World');
    await app.stop();
  });
  // LoopBack GRPC Service
  it('creates a grpc service with custom sequence', async () => {
    // Define Greeter Service Implementation
    class Greeter implements GreeterInterface {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc()
      sayHello(request: HelloRequest): HelloReply {
        const reply: HelloReply = {message: 'Hello ' + request.name};
        return reply;
      }
    }
    class MySequence implements GrpcSequenceInterface {
      constructor(
        @inject(GrpcBindings.CONTEXT) protected context,
        @inject(GrpcBindings.GRPC_METHOD) protected method,
      ) {}
      async unaryCall(call: grpcModule.ServerUnaryCall): Promise<HelloReply> {
        // Do something before call
        const reply = await this.method(call.request);
        reply.message += ' Sequenced';
        // Do something after call
        return reply;
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication(MySequence);
    app.controller(Greeter);
    await app.start();
    // Make GRPC Client Call
    const result: HelloReply = await asyncCall({
      client: getGrpcClient(app),
      method: 'sayHello',
      data: {name: 'World'},
    });
    expect(result.message).to.eql('Hello World Sequenced');
    await app.stop();
  });
});
/**
 * Returns GRPC Enabled Application
 */
function givenApplication(sequence?): Application {
  const grpcConfig: GrpcConfig = {
    port: 0,
    proto: file,
    package: pkg,
  };
  if (sequence) {
    grpcConfig.sequence = sequence;
  }
  return new Application({
    components: [GrpcComponent],
    grpc: grpcConfig,
  });
}
/**
 * Returns GRPC Client
 */
function getGrpcClient(app: Application) {
  const protoProvider = app.getSync(GrpcBindings.PROTO_PROVIDER);
  const proto = protoProvider();
  return new proto.Greeter(
    `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
    grpcModule.credentials.createInsecure(),
  );
}
/**
 * Callback to Promise Wrapper
 */
async function asyncCall(input): Promise<HelloReply> {
  return new Promise<HelloReply>((resolve, reject) =>
    input.client[input.method](input.data, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    }),
  );
}
