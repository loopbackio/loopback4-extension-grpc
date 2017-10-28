// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {ServerProvider, grpc, gRPCServerFn} from '../../..';

describe('ServerProvider', () => {
  it('returns a grpc singleton server', () => {
    const getServer: gRPCServerFn = new ServerProvider().value();
    const server: grpc.Server = getServer();
    expect(server).to.be.an.Object();
    expect(server.bind).to.be.a.Function();
    expect(server.start).to.be.a.Function();
    expect(server.addProtoService).to.be.a.Function();
  });
});
