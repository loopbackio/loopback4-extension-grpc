# gRPC Extension for LoopBack 4

[![Join the chat at https://gitter.im/strongloop/loopback4-extension-grpc](https://badges.gitter.im/strongloop/loopback4-extension-grpc.svg)](https://gitter.im/strongloop/loopback4-extension-grpc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Overview

The `@loopback/grpc` component enables LoopBack 4 as a [gRPC](https://grpc.io/) Server. Also it provides with a gRPC decorator to define your RPC Method implementations from your Application Controllers.

### Features

- Handles unary, client streaming, server streaming and bidirectional streaming calls
- Provides options for TLS and mTLS

## Installation

Install the `@loopback/grpc` component in your LoopBack 4 Application.

```sh
$ npm install --save @loopback/grpc
```

## Component Configuration

```js
import {Application} from '@loopback/core';
import {GrpcComponent, GrpcComponentConfig} from '@loopback/grpc';
import {GreeterController} from './controllers/greeter.controller';
// Grpc Configurations are optional.
const config: GrpcComponentConfig = {
  /* Optional Configs */
};
// Pass the optional configurations
const app = new Application({
  grpc: config,
});
// Add Grpc as Component
app.component(GrpcComponent);
// Bind GreeterController to the LoopBack Application
// only if your Boot Mixins do not load this directory
// see https://loopback.io/doc/en/lb4/Booting-an-Application.html
// app.controller(GreeterController);
// Start App
app.start();
```

## gRPC auto-generated code

The `@loopback/grpc` extension provides you with auto-generated interfaces and configurations for strict development.

The extension will automatically look for proto files within your project structure, creating the corresponding typescript interfaces.

Example:

```sh
- app
| - protos
| | - greeter.proto
| - protos-ts
| - controllers
| | - greeter.controller.ts
```

Once you start your app for first time it will automatically create your typescript interfaces from the `greeter.proto` file.

```sh
- app
| - protos
| | - greeter.proto
| - protos-ts
| | - greeter.ts <--- Auto-generated
| - controllers
| | - greeter.controller.ts
```

Once your interfaces and configurations are created, you can start building your controller logic.

NB: you can also manually generate your interfaces from \_.proto files by creating a `.js` file at the root of your project like below. A good practice would be to add the directory containing your generated `.ts` files to `.gitignore` and to add `node generate.js` to the command `npm run build`.

```ts
const GrpcGenerator = require('@loopback/grpc').GrpcGenerator;
const path = require('path');
const fs = require('fs');

function formatWithColor(message, color) {
  return `\x1b[${color}m${message}\x1b[0m`;
}

const protoTsPath = path.join(process.cwd(), 'src', 'protos-ts');
try {
  fs.statSync(protoTsPath);
} catch (e) {
  fs.mkdirSync(protoTsPath);
}

const generator = new GrpcGenerator({
  protoPattern: '**/protos/**/*.proto',
  // additionalArgs: '--experimental_allow_proto3_optional',
  tsOutputPath: protoTsPath,
  protoPath: path.join(process.cwd(), 'src', 'protos'),
  generate: true,
  load: false,
});

console.log(formatWithColor('Generating proto.ts files from *.proto...', 33));
generator.execute();
console.log(formatWithColor('All proto.ts files have been generated', 32));
```

## gRPC Controller

The `@loopback/grpc` component provides you with a handy decorator to implement gRPC Methods within your LoopBack controllers. The decorator will automatically map the correct calls from the file descriptor, the method name and the controller name. If you want an other suffix than `(Ctrl|Controller)`, you can use the argument `controllerNameRegex`.

`app/controllers/greeter.controller.ts`

```ts
import {
  sendUnaryData,
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
} from '@grpc/grpc-js';
import {
  getSpecsFromMethodDefinitionAndProtoMetadata,
  grpc,
} from '../../../decorators/grpc.decorator';
import BaseController from '../../../grpc.controller';
import {
  GreeterServer,
  GreeterService,
  protoMetadata,
  TestRequest,
  TestResponse,
} from './greeter';

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

  @grpc(
    getSpecsFromMethodDefinitionAndProtoMetadata(
      GreeterService.clientStreamTest,
      protoMetadata.fileDescriptor,
    ),
  )
  async clientStreamTest(
    call: ServerReadableStream<TestRequest, TestResponse>,
    callback: sendUnaryData<TestResponse>,
  ): Promise<void> {
    const names = await new Promise<string[]>((resolve, reject) => {
      const names: string[] = [];
      call.on('data', (chunk: TestRequest) => names.push(chunk.name));
      call.on('error', (err) => reject(err));
      call.on('end', () => resolve(names));
    });
    callback(null, {
      message: names.join(' '),
    });
  }

  @grpc(
    getSpecsFromMethodDefinitionAndProtoMetadata(
      GreeterService.serverStreamTest,
      protoMetadata.fileDescriptor,
    ),
  )
  async serverStreamTest(
    call: ServerWritableStream<TestRequest, TestResponse>,
  ): Promise<void> {
    const req = call.request.name.split(' ');
    const sleep = (seconds = 0) =>
      new Promise((resolve) => setTimeout(resolve, seconds));
    const writeAfterSleep = (payload: TestResponse, seconds = 0) =>
      (async () => {
        await sleep(seconds);
        call.write(payload);
      })();

    const promises: Promise<void>[] = [];
    promises.push(
      writeAfterSleep({
        message: req[0],
      }),
    );
    for (let i = 1; i < req.length; i++) {
      promises.push(
        writeAfterSleep(
          {
            message: req[i],
          },
          i * 200,
        ),
      );
      if (i === req.length - 1) {
        promises.push(
          (async () => {
            await sleep((i + 1) * 200);
            call.end();
          })(),
        );
      }
    }
    await Promise.all(promises);
  }

  @grpc(
    getSpecsFromMethodDefinitionAndProtoMetadata(
      GreeterService.bidiStreamTest,
      protoMetadata.fileDescriptor,
    ),
  )
  async bidiStreamTest(
    call: ServerDuplexStream<TestRequest, TestResponse>,
  ): Promise<void> {
    await new Promise<string[]>((resolve, reject) => {
      call.on('data', (chunk: TestRequest) =>
        call.write({
          message: `Got ${chunk.name} !`,
        }),
      );
      call.on('error', (err) => reject(err));
      call.on('end', () => call.end());
    });
  }
}
```

## Proto Example

`app/protos/greeter.proto`

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

## Setting up TLS and mTLS

```ts
import {GrpcComponentConfig} from '@loopback/grpc';

const grpcConfig: GrpcComponentConfig = {
  server: {
    tls: {
      rootCertPath: 'path/to/root/cert',
      keyCertPairPaths: [
        {
          privateKeyPath: 'path/to/private/key/for/server',
          certChainPath: 'path/to/cert/chain/for/server',
        },
      ],
    },
    // set it to false/undefined to disable client certificate verification
    checkClientCertificate: true,
  },
};
```

### Client side integration

Tests can be a good starting point for your client side integration.

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

## Todo

- Maybe watch for proto changes.

## Contributors

See [all contributors](https://github.com/strongloop/loopback4-extension-grpc/graphs/contributors).

## License

MIT

[grpc]: (https://grpc.io)
