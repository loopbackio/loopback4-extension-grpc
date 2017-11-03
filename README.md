# gRPC Extension for LoopBack 4

[![Join the chat at https://gitter.im/strongloop/loopback4-extension-grpc](https://badges.gitter.im/strongloop/loopback4-extension-grpc.svg)](https://gitter.im/strongloop/loopback4-extension-grpc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Overview
The `@loopback/grpc` component enables LoopBack 4 as a [gRPC] Server. Also it provides with a  [gRPC] decorator to define your RPC Method implementations from your Application Controllers.

## Installation
Install the `@loopback/grpc` component in your LoopBack 4 Application.

```sh
$ npm install --save @loopback/grpc
```

## Component Configuration
```js
import {Application} from '@loopback/core';
import {GrpcComponent, GrpcConfig} from '@loopback/grpc';
import {MyGreeter} from './MyGreeter';

const config: GrpcConfig = {
    proto: './file.proto',
    package: 'myawesomepackage'
}

const app = new Application({
    components: [GrpcComponent],
    grpc: config
});

app.controller(MyGreeter});

await app.start();
```

## Grpc Decorator
The `@loopback/grpc` component provides you with a handy decorator to implement GRPC Methods.

```js
import {grpc} from '@loopback/grpc';
// You create the following types according your own proto.file
import {Greeter, HelloRequest, HelloReply} from './types';
/**
 * @class MyGreeter
 * @description Implements grpc proto service
 **/
export class MyGreeter implements Greeter {
    // Tell LoopBack that this is a Service RPC implementation
    @grpc()
    SayHello(request: HelloRequest): HelloReply {
        const reply: HelloReply = {message: 'Hello ' + request.name};
        return reply;
    }
}
```

## Contribute
Get started by either downloading this project or cloning it as follows:

```sh
$ git clone https://github.com/strongloop/loopback4-extension-grpc.git
$ cd loopback4-extension-grpc && npm install
```

## Contributions
- [Guidelines](https://github.com/strongloop/loopback-next/wiki/Contributing#guidelines)
- [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Tests
run `npm test` from the root folder.

## Contributors
See [all contributors](https://github.com/strongloop/loopback4-extension-grpc/graphs/contributors).

## License
MIT

[gRPC]:(https://grpc.io)