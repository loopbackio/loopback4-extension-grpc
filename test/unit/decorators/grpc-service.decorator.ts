// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {gRPCService} from '../../..';
const grpc = require('grpc');

describe('@gRPCService', () => {
  it('creates a micro service and sends a message', () => {
    const host: string = '127.0.0.1';
    const port: number = 8080;
    const proto: string = './test/protos/greeter.proto';
    const pkg: string = 'test';

    @gRPCService({
      host,
      port,
      proto,
      package: pkg,
      service: 'Greeter',
      rpcs: ['sayHello'],
    })
    class Greeter {
      constructor() {}
      sayHello(call: any, callback: Function) {
        callback(null, {message: 'Hello ' + call.request.name});
      }
    }
    // Load Micro Service
    new Greeter();
    // Load Client
    const greeter_proto = grpc.load(proto)[pkg];
    const client = new greeter_proto.Greeter(
      `${host}:${port}`,
      grpc.credentials.createInsecure(),
    );
    client.sayHello({name: 'Wolrd'}, function(err: Error, response: any) {
      expect(response.message).to.eql('Hello World');
    });
  });
});
