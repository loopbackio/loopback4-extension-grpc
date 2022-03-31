// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Provider} from '@loopback/context';
import {Server} from '@grpc/grpc-js';

/**
 * This provider will creates a gRPC Server
 */
export class ServerProvider implements Provider<Server> {
  private server = new Server();
  public value(): Server {
    return this.server;
  }
}
