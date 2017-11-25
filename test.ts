import {Application} from '@loopback/core';
import {GrpcComponent, GrpcBindings} from './';
import * as grpcModule from 'grpc';

const app = new Application({
  components: [GrpcComponent],
  grpc: {
    port: 0,
    proto: './test/acceptance/greeter.proto',
    package: 'greeterpackage',
  },
});

app.start();

const client = getGrpcClient(app);

client.sayHello({name: 'World'}, (err, response) => {
  console.log('ERROR: ', err);
  console.log('RESPONSE: ', response);
});

/**
 * Returns GRPC Client
 **/
function getGrpcClient(app: Application) {
  const protoProvider = app.getSync(GrpcBindings.PROTO_PROVIDER);
  const proto = protoProvider();
  console.log(
    `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
  );
  return new proto.Greeter(
    `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
    grpcModule.credentials.createInsecure(),
  );
}
