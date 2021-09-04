## Overview

Decorators provide annotations for class methods and arguments. Decorators use the form `@decorator` where `decorator` is the name of the function that will be called at runtime.

### gRPC Decorator

This decorator allows you to annotate a `Controller` class. The decorator will setup a GRPC Service.

**Example**

```js
/**
 * Setup gRPC MicroService
 **/
//myproject/controllers/greeter.controller.ts
//myproject/protos/greeter/greeter.proto
//myproject/protos-ts/greeter/greeter.ts
//Note: greeter.proto.ts is automatically generated from
//greeter.proto
import {
  grpc,
  getSpecsFromMethodDefinitionAndProtoMetadata,
} from '@loopback/grpc';
import {
  GreeterServer,
  GreeterService,
  TestRequest,
  TestResponse,
  protoMetadata,
} from '../protos-ts/greeter';

export default class GreeterController extends BaseController
  implements GreeterServer {
  // Tell LoopBack that this is a Service RPC implementation
  @grpc(
    getSpecsFromMethodDefinitionAndProtoMetadata(
      GreeterService.unaryTest,
      protoMetadata.fileDescriptor,
    ),
  )
  async unaryTest(
    call: ServerUnaryCall<TestRequest, TestResponse>,
    callback: sendUnaryData<TestResponse>,
  ): Promise<void> {
    callback(null, {
      message: 'Hello ' + call.request.name,
    });
  }
}
```

## Example Proto File

```proto
syntax = "proto3";
package greeterpackage;

service Greeter {
  // Sends a greeting
  rpc UnaryTest (TestRequest) returns (TestResponse) {}
  rpc ClientStreamTest (stream TestRequest) returns (TestResponse) {}
  rpc ServerStreamTest (TestRequest) returns (stream TestResponse) {}
  rpc BidiStreamTest (stream TestRequest) returns (stream TestResponse) {}
}

// The request message containing the user's name.
message TestRequest {
  string name = 1;
}

// The response message containing the greetings
message TestResponse {
  string message = 1;
}
```

## Related Resources

You can check out the following resource to learn more about decorators and how they are used in LoopBack Next.

- [TypeScript Handbook: Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Decorators in LoopBack](http://loopback.io/doc/en/lb4/Decorators.html)
- [gRPC in NodeJS](https://grpc.io/docs/quickstart/node.html)
