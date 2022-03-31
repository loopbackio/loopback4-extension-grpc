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

export default class GreeterController
  extends BaseController
  implements GreeterServer
{
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
