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
import {GrpcComponent, Config} from '@loopback/grpc';
import {GreeterCtrl} from './controllers/greeter/greeter.ctrl';
// Grpc Configurations are optional.
const config: Config.Component = { /* Optional Configs */ }
// Add Grpc as Component and pass the optional configurations
const app = new Application({
    components: [GrpcComponent],
    grpc: config
});
// Bind GreeterCtrl to the LoopBack Application
app.controller(GreeterCtrl);
// Start App
app.start();
```
## Grpc auto-generated code
The `@loopback/grpc` extension provides you with auto-generated interfaces and configurations for strict development.

The extension will automatically look for proto files within your project structure, creating the corresponding typescript interfaces.

Example:

````sh
- app
| - controllers
| | - greeter
| | | - greeter.proto
| | | - greeter.ctrl.ts
````

Once you start your app for first time it will automatically create your typescript interfaces from the `greeter.proto` file.

````sh
- app
| - controllers
| | - greeter
| | | - greeter.proto
| | | - greeter.proto.ts <--- Auto-generated
| | | - greeter.ctrl.ts
````

Once your interfaces and configurations are created, you can start building your controller logic.

## Grpc Controller
The `@loopback/grpc` component provides you with a handy decorator to implement GRPC Methods within your LoopBack controllers.

`app/controllers/greeter/greeter.ctrl.ts`
```js
import {grpc} from '@loopback/grpc';
import {Greeter} from '/greeter.proto';
/**
 * @class GreeterCtrl
 * @description Implements grpc proto service
 **/
export class GreeterCtrl implements Greeter.Service {
    // Tell LoopBack that this is a Service RPC implementation
    @grpc(Greeter.Config.SayHello)
    sayHello(request: Greeter.HelloRequest): Greeter.HelloReply {
        return {message: 'Hello ' + request.name};
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