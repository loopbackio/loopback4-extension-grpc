// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {MetadataInspector} from '@loopback/metadata';
import {expect} from '@loopback/testlab';

import {GRPC_METHODS} from '../../../decorators/grpc.decorator';
import GreeterController from '../../fixtures/server/greeter.controller';

describe('@grpc decorator', () => {
  it('defines reflection metadata for rpc method', () => {
    const controllerMethods = MetadataInspector.getAllMethodMetadata(
      GRPC_METHODS,
      GreeterController.prototype,
    );
    expect(controllerMethods).to.have.property('unaryTest');
    expect(controllerMethods).to.have.property('clientStreamTest');
    expect(controllerMethods).to.have.property('serverStreamTest');
    expect(controllerMethods).to.have.property('bidiStreamTest');
  });
});
