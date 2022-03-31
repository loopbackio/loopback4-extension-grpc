// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {Server as PkgGrpcServer} from '@grpc/grpc-js';
import {ServerProvider} from '../../..';

describe('ServerProvider', () => {
  it('returns a grpc singleton server', () => {
    const server: PkgGrpcServer = new ServerProvider().value();
    expect(server).to.be.an.Object();
    expect(server.bind).to.be.a.Function();
    expect(server.start).to.be.a.Function();
    expect(server.addProtoService).to.be.a.Function();
  });
});
