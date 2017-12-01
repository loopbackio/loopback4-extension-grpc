import * as grpc_module from 'grpc';
import {Application} from '@loopback/core';
import {GrpcComponent, grpc} from './';
import {EventEmitter} from 'events';
import {
  //  Greeter,
  //  HelloRequest,
  //  HelloReply,
  BookService,
  BookList,
  Empty,
  Book,
  BookIdRequest,
} from './test/acceptance/test.proto2';

const app = new Application({
  components: [GrpcComponent],
  grpc: {host: '127.0.0.1', port: 8080},
});
const books: Book[] = [
  {id: 123, title: 'A Tale of Two Cities', author: 'Charles Dickens'},
];
const bookStream: EventEmitter = new EventEmitter();
class BookCtrl {
  @grpc(BookService.List)
  list(request: Empty): BookList {
    console.log('AM I EVEN HERE?');
    return {books};
  }
  @grpc(BookService.Insert)
  insert(book: Book): Empty {
    books.push(book);
    bookStream.emit('new_book', book);
    return {};
  }
  @grpc(BookService.Get)
  get(request: BookIdRequest): Book | BookService.Error {
    const filter: Book[] = books.filter((book: Book) => book.id === request.id);
    // If there is no book found then return an error
    if (filter.length === 0)
      return {
        name: 'Not Found',
        message: `Unable to find book using ${request.id}`,
        code: grpc_module.status.NOT_FOUND,
      };

    throw new Error('Method not implemented.');
  }
  @grpc(BookService.Watch)
  watch(watchStream: grpc_module.ServerWriteableStream) {
    bookStream.on('new_book', watchStream.emit);
  }
}

app.controller(BookCtrl);

console.log('Before start');
app.start();
console.log('After start');
const proto: any = grpc_module.load('./test/acceptance/book.proto');
const client = new proto['testpackage'].BookService(
  `127.0.0.1:8080`,
  grpc_module.credentials.createInsecure(),
);
client.list({}, books => {
  console.log('BOOOOOOOOKS!!!', books);
});

//app.stop();
