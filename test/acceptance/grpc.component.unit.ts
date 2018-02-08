// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {inject, Constructor} from '@loopback/context';
import {Application} from '@loopback/core';
import {GrpcSequenceInterface, Config, GrpcServer, GrpcSequence} from '../../';
import {grpc} from '../../';
import * as grpcModule from 'grpc';
import {GrpcComponent, GrpcBindings} from '../..';
import {Greeter, HelloRequest, HelloReply} from './greeter.proto';

// tslint:disable:no-any

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
  it('defines grpc component configurations', async () => {
    const app: Application = givenApplication();
    const lbGrpcServer = await app.getServer<GrpcServer>('GrpcServer');
    expect(lbGrpcServer.getSync(GrpcBindings.PORT)).to.be.eql(8080);
  });
  // LoopBack GRPC Service
  it('creates a grpc service', async () => {
    // Define Greeter Service Implementation
    class GreeterCtrl implements Greeter.Service {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc(Greeter.SayHello)
      sayHello(request: HelloRequest): HelloReply {
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
    class GreeterCtrl implements Greeter.Service {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc(Greeter.SayHello)
      sayHello(request: HelloRequest): HelloReply {
        const reply: HelloReply = {message: 'Hello ' + request.name};
        return reply;
      }
    }

    class MySequence implements GrpcSequenceInterface {
      constructor(
        @inject(GrpcBindings.GRPC_CONTROLLER)
        protected controller: {[method: string]: Function},
        @inject(GrpcBindings.GRPC_METHOD_NAME) protected method: string,
      ) {}
      async unaryCall(call: grpcModule.ServerUnaryCall): Promise<HelloReply> {
        // Do something before call
        const reply = await this.controller[this.method](call.request);
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
 **/
function givenApplication(
  sequence?: Constructor<GrpcSequenceInterface>,
): Application {
  const grpcConfig: Config.Component = {port: 8080};
  if (sequence) {
    grpcConfig.sequence = sequence;
  }
  const app = new Application({
    grpc: grpcConfig,
  });
  app.component(GrpcComponent);
  return app;
}
/**
 * Returns GRPC Client
 **/
function getGrpcClient(app: Application) {
  const proto = grpcModule.load('./test/acceptance/greeter.proto')[
    'greeterpackage'
  ] as grpcModule.GrpcObject;
  const client = proto.Greeter as typeof grpcModule.Client;
  return new client(
    `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
    grpcModule.credentials.createInsecure(),
  );
}
/**
 * Callback to Promise Wrapper
 **/
async function asyncCall(input: {
  client: grpcModule.Client;
  method: string;
  data: any;
}): Promise<HelloReply> {
  const client = input.client as any;
  return new Promise<HelloReply>((resolve, reject) =>
    client[input.method](input.data, (err: any, response: HelloReply) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    }),
  );
}
