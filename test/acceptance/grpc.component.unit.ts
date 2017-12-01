// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback4-extension-starter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {inject} from '@loopback/context';
import {Application} from '@loopback/core';
import {GrpcSequenceInterface, Config} from '../../';
//import {Config} from '../../';
import {grpc} from '../../src/decorators/grpc.decorator';
import * as grpcModule from 'grpc';
import {GrpcComponent, GrpcBindings} from '../..';
import {Greeter, HelloRequest, HelloReply} from './greeter.proto';
import {BookService, Empty, Book, BookList, BookIdRequest} from './book.proto';
import {EventEmitter} from 'events';
/** 
Only run this on grpc typescript generation issues
Comment all tests to do so.
const app: Application = givenApplication();
(async () => {
  await app.start();
  await app.stop();
})();
**/
describe('GrpcComponent', () => {
  // GRPC Component Configurations
  it('defines grpc component configurations', async () => {
    const app: Application = givenApplication();
    const lbGrpcServer: any = await app.getServer('GrpcServer');
    expect(lbGrpcServer.getSync(GrpcBindings.PORT)).to.be.eql(8080);
  });

  // LoopBack GRPC Service
  it('creates a grpc service', async () => {
    // Define Greeter Service Implementation
    class GreeterCtrl implements Greeter.Interface {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc(Greeter.SayHello)
      sayHello(request: HelloRequest): HelloReply {
        return {
          message: 'Hello ' + request.name,
        };
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(GreeterCtrl);
    await app.start();
    // Make GRPC Client Call
    const result: HelloReply = await asyncCall({
      client: getGrpcClient(app),
      method: 'SayHello',
      data: {name: 'World'},
    });
    expect(result.message).to.eql('Hello World');
    await app.stop();
  });
  // LoopBack GRPC Service
  it('creates a grpc service with custom sequence', async () => {
    // Define Greeter Service Implementation
    class GreeterCtrl implements Greeter.Interface {
      // Tell LoopBack that this is a Service RPC implementation
      @grpc(Greeter.SayHello)
      sayHello(request: HelloRequest): HelloReply {
        const reply: HelloReply = {message: 'Hello ' + request.name};
        return reply;
      }
    }
    class MySequence implements GrpcSequenceInterface {
      constructor(
        @inject(GrpcBindings.CONTEXT) protected context,
        @inject(GrpcBindings.GRPC_METHOD) protected method,
      ) {}
      async unaryCall(call: grpcModule.ServerUnaryCall): Promise<HelloReply> {
        // Do something before call
        const reply = await this.method(call.request);
        reply.message += ' Sequenced';
        // Do something after call
        return reply;
      }
      duplexStream(request: grpcModule.ServerDuplexStream): void {
        throw new Error('Method not implemented.');
      }
      readableStream(request: grpcModule.ServerReadableStream): void {
        throw new Error('Method not implemented.');
      }
      writeableStream(request: grpcModule.ServerWriteableStream): void {
        throw new Error('Method not implemented.');
      }
    }
    // Load LoopBack Application
    const app: Application = givenApplication(MySequence);
    app.controller(GreeterCtrl);
    await app.start();
    // Make GRPC Client Call
    const result: HelloReply = await asyncCall({
      client: getGrpcClient(app),
      method: 'SayHello',
      data: {name: 'World'},
    });
    expect(result.message).to.eql('Hello World Sequenced');
    await app.stop();
  });

  // LoopBack GRPC Stream Service
  it('creates a grpc stream service', async () => {
    const books: Book[] = [
      {id: 1, title: 'A Tale of Two Cities', author: 'Charles Dickens'},
    ];
    const bookStream: EventEmitter = new EventEmitter();
    // Define Book Service Implementation
    class BookCtrl implements BookService.Interface {
      @grpc(BookService.Insert)
      insert(request: Book): Empty | BookService.Error {
        books.push(request);
        bookStream.emit('new_book', request);
        return {};
      }
      @grpc(BookService.List)
      list(request: Empty): BookList | BookService.Error {
        return {books};
      }
      @grpc(BookService.Get)
      get(request: BookIdRequest): BookService.Error | Book {
        const filtered = books.filter((book: Book) => book.id === request.id);
        if (filtered.length === 0)
          return {
            name: 'Not Found',
            message: 'Book not found',
            code: grpcModule.status.NOT_FOUND,
          };
        return filtered[0];
      }
      @grpc(BookService.Watch)
      watch(request: any): BookService.Error | Book {
        bookStream.on('new_book', book => request.emit(book));
        throw new Error('Method not implemented.');
      }
    }

    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(BookCtrl);
    await app.start();
    const client = getGrpcClient(app, 'Book', true);
    //client.watch({});
    /* watchStream.on('data', book => {
      console.log('Hooray');
      console.log(book);
    });*/
    // Get Watcher
    /*const list2: BookList = await asyncStream({
      client,
      method: 'watch',
      data: {},
    });
    console.log(list2);*/
    //watcher.on('data', book => console.log('PLISSSSSS', book));
    // Make GRPC Client Call
    await asyncCall({
      client,
      method: 'insert',
      data: {id: 2, title: 'ZUP', author: 'JC'},
    });
    // Make GRPC Client Call
    const list: BookList = await asyncCall({
      client,
      method: 'list',
      data: {},
    });
    expect(list.books).to.eql(books);
    await app.stop();
  });
});
/**
 * Returns GRPC Enabled Application
 * Port should always be different per each test
 * https://github.com/grpc/grpc/issues/12506
 **/
let last = 8080;
function givenApplication(sequence?): Application {
  const grpcConfig: Config.Component = {port: last};
  last += 1;
  if (sequence) {
    grpcConfig.sequence = sequence;
  }
  return new Application({
    components: [GrpcComponent],
    grpc: grpcConfig,
  });
}
/**
 * Returns GRPC Client
 **/
function getGrpcClient(app: Application, service = 'Greeter', postfix = false) {
  const lowered: string = service.toLowerCase();
  service = `${service}${postfix ? 'Service' : ''}`;
  const proto: any = grpcModule.load(`./test/acceptance/${lowered}.proto`);
  //console.log(proto);
  const client = new proto[`${lowered}package`][service](
    `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
    grpcModule.credentials.createInsecure(),
  );
  return client;
}
/**
 * Callback to Promise Wrapper
 **/

async function asyncCall(input): Promise<any> {
  return new Promise<any>((resolve, reject) =>
    input.client[input.method](input.data, (err, response) => {
      if (err) {
        console.log('CALL ERROR: ', err);
        reject(err);
      } else {
        resolve(response);
      }
    }),
  );
}
/*
async function asyncStream(input): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    if (input.method) {
      resolve(input.client[input.method](input.data));
    } else {
      reject(new Error('Missing method'));
    }
  });
}
*/
