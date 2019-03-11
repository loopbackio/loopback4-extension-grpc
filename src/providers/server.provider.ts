// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {Server} from 'grpc';
/**
 * @class ServerProvider
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description This provider will return the GRPC Server
 */
export class ServerProvider implements Provider<Server> {
  private server = new Server();
  public value(): Server {
    return this.server;
  }
}
