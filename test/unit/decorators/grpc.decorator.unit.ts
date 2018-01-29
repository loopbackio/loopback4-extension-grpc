// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {MetadataInspector} from '@loopback/metadata';
import {grpc, GrpcBindings, Config, GRPC_METHODS} from '../../..';

import {
  Greeter,
  HelloRequest,
  HelloReply,
} from '../../acceptance/greeter.proto';
import {Reflector} from '@loopback/context';

describe('@rpc decorator', () => {
  it('defines reflection metadata for rpc method', () => {
    class GreeterCtrl implements Greeter.Service {
      @grpc(Greeter.SayHello)
      sayHello(request: HelloRequest): HelloReply {
        return {message: `hello ${request.name}`};
      }
      Helper(): boolean {
        return true;
      }
    }

    const proto = GreeterCtrl.prototype;
    const controllerMethods = MetadataInspector.getAllMethodMetadata(
      GRPC_METHODS,
      GreeterCtrl.prototype,
    );
    expect(controllerMethods).to.have.property('sayHello');
  });
});
