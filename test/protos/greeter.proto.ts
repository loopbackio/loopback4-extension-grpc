// Copyright IBM Corp. 2013,2017. All Rights Reserved.
// Node module: loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
export interface HelloRequest {
  name: string;
}
export interface HelloReply {
  message: string;
}
export interface GreeterInterface {
  SayHello(request: HelloRequest): HelloReply;
}
