// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {grpc} from '../../..';
import {GrpcBindings} from '../../../src/keys';
import {Config} from '../../../src/types';
import {
  Greeter,
  HelloRequest,
  HelloReply,
} from '../../acceptance/greeter.proto';
import {Reflector} from '@loopback/context';

describe('@rpc decorator', () => {
  it('defines reflection metadata for rpc method', () => {
    class GreeterCtrl implements Greeter.Interface {
      @grpc(Greeter.SayHello)
      sayHello(request: HelloRequest): HelloReply {
        return {message: `hello ${request.name}`};
      }
      Helper(): boolean {
        return true;
      }
    }
    const flags: {[key: string]: boolean} = {};
    const proto = GreeterCtrl.prototype;
    const controllerMethods: string[] = Object.getOwnPropertyNames(
      proto,
    ).filter(key => key !== 'constructor' && typeof proto[key] === 'function');
    for (const methodName of controllerMethods) {
      const config: Config.Method = Reflector.getMetadata(
        GrpcBindings.LB_GRPC_HANDLER,
        proto,
        methodName,
      );
      if (config) flags[methodName] = true;
    }
    expect(flags).to.deepEqual({sayHello: true});
  });
});
