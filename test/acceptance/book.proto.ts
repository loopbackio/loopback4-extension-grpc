import * as grpc from "grpc";
export namespace BookService {
  /**
   * @interface BookService.Error
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description BookService interface that provides types
    * for results with errors. This is extending from grpc ServerError.
   */
  export interface Error extends grpc.ServiceError {}
  /**
   * @interface BookService.Interface
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description BookService interface that provides types
   * for methods from the given gRPC BookService Service.
   */
  export interface Interface {
    /**
     * @method BookService.Interface.list
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description BookService method declaration
     * from the given gRPC BookService service.
     */
    list(request: Empty): BookList | BookService.Error;
    /**
     * @method BookService.Interface.insert
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description BookService method declaration
     * from the given gRPC BookService service.
     */
    insert(request: Book): Empty | BookService.Error;
    /**
     * @method BookService.Interface.get
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description BookService method declaration
     * from the given gRPC BookService service.
     */
    get(request: BookIdRequest): Book | BookService.Error;
    /**
     * @method BookService.Interface.watch
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description BookService method declaration
     * from the given gRPC BookService service.
     */
    watch(request: Book): Book | BookService.Error;
  }
  /**
   * @namespace BookService.List
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description BookService method configuration
   * from the given gRPC BookService service.
   */
  export namespace List {
    export const PROTO_NAME: string = 'book.proto';
    export const PROTO_PACKAGE: string = 'bookpackage';
    export const SERVICE_NAME: string = 'BookService';
    export const METHOD_NAME: string = 'List';
    export const REQUEST_STREAM: boolean = false;
    export const RESPONSE_STREAM: boolean = false;
  }
  /**
   * @namespace BookService.Insert
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description BookService method configuration
   * from the given gRPC BookService service.
   */
  export namespace Insert {
    export const PROTO_NAME: string = 'book.proto';
    export const PROTO_PACKAGE: string = 'bookpackage';
    export const SERVICE_NAME: string = 'BookService';
    export const METHOD_NAME: string = 'Insert';
    export const REQUEST_STREAM: boolean = false;
    export const RESPONSE_STREAM: boolean = false;
  }
  /**
   * @namespace BookService.Get
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description BookService method configuration
   * from the given gRPC BookService service.
   */
  export namespace Get {
    export const PROTO_NAME: string = 'book.proto';
    export const PROTO_PACKAGE: string = 'bookpackage';
    export const SERVICE_NAME: string = 'BookService';
    export const METHOD_NAME: string = 'Get';
    export const REQUEST_STREAM: boolean = false;
    export const RESPONSE_STREAM: boolean = false;
  }
  /**
   * @namespace BookService.Watch
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description BookService method configuration
   * from the given gRPC BookService service.
   */
  export namespace Watch {
    export const PROTO_NAME: string = 'book.proto';
    export const PROTO_PACKAGE: string = 'bookpackage';
    export const SERVICE_NAME: string = 'BookService';
    export const METHOD_NAME: string = 'Watch';
    export const REQUEST_STREAM: boolean = false;
    export const RESPONSE_STREAM: boolean = true;
  }
}
/**
 * @interface Empty
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Empty interface that provides properties
 * and typings from the given gRPC Empty Message.
 */
export interface Empty {
}
/**
 * @interface Book
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Book interface that provides properties
 * and typings from the given gRPC Book Message.
 */
export interface Book {
  id: number;
  title: string;
  author: string;
}
/**
 * @interface BookList
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description BookList interface that provides properties
 * and typings from the given gRPC BookList Message.
 */
export interface BookList {
  books?: Book[];
}
/**
 * @interface BookIdRequest
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description BookIdRequest interface that provides properties
 * and typings from the given gRPC BookIdRequest Message.
 */
export interface BookIdRequest {
  id: number;
}
