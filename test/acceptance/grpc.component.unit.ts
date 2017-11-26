// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {inject} from '@loopback/context';
import {Application} from '@loopback/core';
import {GrpcSequenceInterface, Config} from '../../';
//import {GrpcConfig} from '../../';
import {grpc} from '../../src/decorators/grpc.decorator';
import * as grpcModule from 'grpc';
import {GrpcComponent, GrpcBindings} from '../..';
import {Greeter} from './greeter.proto';
/** 
Only run this on grpc typescript generation issues
Comment all tests to do so.
const app: Application = givenApplication();
(async () => {
  await app.start();
  await app.stop();
})();
**/
describe('GrpcComponent', () => {
  // GRPC Component Configurations
  /*it('defines grpc component configurations', async () => {
    const app: Application = givenApplication();
    const lbGrpcServer: any = await app.getServer('GrpcServer');
    expect(lbGrpcServer.getSync(GrpcBindings.PROTO_PKG)).to.be.eql(pkg);
    expect(lbGrpcServer.getSync(GrpcBindings.PROTO_FILE)).to.be.eql(file);
  });*/
  // LoopBack GRPC Service
  it('creates a grpc service', async () => {
    // Define Greeter Service Implementation
    class GreeterCtrl implements Greeter.Service {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc(Greeter.Config.SayHello)
      sayHello(request: Greeter.HelloRequest): Greeter.HelloReply {
        return {
          message: 'Hello ' + request.name,
        };
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(GreeterCtrl);
    await app.start();
    // Make GRPC Client Call
    const result: Greeter.HelloReply = await asyncCall({
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
    class GreeterCtrl implements Greeter.Service {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc(Greeter.Config.SayHello)
      sayHello(request: Greeter.HelloRequest): Greeter.HelloReply {
        const reply: Greeter.HelloReply = {message: 'Hello ' + request.name};
        return reply;
      }
    }
    class MySequence implements GrpcSequenceInterface {
      constructor(
        @inject(GrpcBindings.CONTEXT) protected context,
        @inject(GrpcBindings.GRPC_METHOD) protected method,
      ) {}
      async unaryCall(
        call: grpcModule.ServerUnaryCall,
      ): Promise<Greeter.HelloReply> {
        // Do something before call
        const reply = await this.method(call.request);
        reply.message += ' Sequenced';
        // Do something after call
        return reply;
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication(MySequence);
    app.controller(GreeterCtrl);
    await app.start();
    // Make GRPC Client Call
    const result: Greeter.HelloReply = await asyncCall({
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
 **/
function givenApplication(sequence?): Application {
  const grpcConfig: Config.Component = {port: 0};
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
 **/
function getGrpcClient(app: Application) {
  const proto: any = grpcModule.load('./test/acceptance/greeter.proto')[
    'greeterpackage'
  ];
  return new proto.Greeter(
    `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
    grpcModule.credentials.createInsecure(),
  );
}
/**
 * Callback to Promise Wrapper
 **/
async function asyncCall(input): Promise<Greeter.HelloReply> {
  return new Promise<Greeter.HelloReply>((resolve, reject) =>
    input.client[input.method](input.data, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    }),
  );
}
