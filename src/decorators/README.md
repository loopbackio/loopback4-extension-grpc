# Decorators

## Overview

Decorators provide annotations for class methods and arguments. Decorators use the form `@decorator` where `decorator` is the name of the function that will be called at runtime.

## Basic Usage

### gRPC

This decorator allows you to annotate a `Controller` class. The decorator will setup a GRPC Service.

**Example**
````js
/**
* Setup gRPC MicroService
**/
class Greeter implements GreeterInterface {
  @grpc()
  SayHello(request: HelloRequest): HelloReply {
    return {message: `hello ${request.name}`};
  }
}
````

## Example Proto File

````proto
package awesomepackage;
syntax = "proto3";
 
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
````

## Related Resources

You can check out the following resource to learn more about decorators and how they are used in LoopBack Next.

- [TypeScript Handbook: Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Decorators in LoopBack](http://loopback.io/doc/en/lb4/Decorators.html)
- [gRPC in NodeJS](https://grpc.io/docs/quickstart/node.html)
