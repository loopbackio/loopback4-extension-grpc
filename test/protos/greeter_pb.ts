// package: greeterpackage
// file: greeter.proto
import * as jspb from "google-protobuf";



export interface HelloRequest extends jspb.Message {
  name: string;
}


export interface HelloReply extends jspb.Message {
  message: string;
}

export interface GreeterInterface {
  sayHello(request: HelloRequest): HelloReply;
}

export namespace GreeterConfig {
    export class SayHello {
      static readonly methodName: string = 'SayHello';
      static readonly service: string = 'Greeter;'
      static readonly requestStream: boolean = false;
      static readonly responseStream: boolean = false;
    }
}
