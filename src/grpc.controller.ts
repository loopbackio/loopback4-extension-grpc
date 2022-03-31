/* eslint-disable @typescript-eslint/no-explicit-any */
import {UntypedServiceImplementation} from '@grpc/grpc-js';
import {
  handleSyncOrAsyncBidiStreamingCall,
  handleSyncOrAsyncClientStreamingCall,
  handleSyncOrAsyncServerStreamingCall,
  handleSyncOrAsyncUnaryCall,
} from './types';

export default class BaseController implements UntypedServiceImplementation {
  [name: string]:
    | handleSyncOrAsyncUnaryCall<any, any>
    | handleSyncOrAsyncClientStreamingCall<any, any>
    | handleSyncOrAsyncServerStreamingCall<any, any>
    | handleSyncOrAsyncBidiStreamingCall<any, any>
    | any;
}
