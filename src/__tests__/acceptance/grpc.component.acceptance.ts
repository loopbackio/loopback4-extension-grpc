// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Constructor} from '@loopback/context';
import {Application} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {GrpcSequence, GrpcSequenceInterface} from '../../grpc.sequence';
import {TestRequest, TestResponse} from '../fixtures/server/greeter';
import {GreeterClient} from '../fixtures/client/greeter';
import {ChannelCredentials, ServerUnaryCall, ServiceError} from '@grpc/grpc-js';
import {join} from 'path';
import GreeterController from '../fixtures/server/greeter.controller';
import {GrpcBindings} from '../../keys';
import {GrpcServer} from '../../grpc.server';
import {GrpcComponentConfig} from '../../types';
import {GrpcComponent} from '../../grpc.component';
// import {readFileSync} from 'fs';

describe('GrpcComponent', () => {
  // gRPC Component Configurations
  it('defines grpc component configurations', async () => {
    const app: Application = givenApplication();
    const lbGrpcServer = await app.getServer<GrpcServer>('GrpcServer');
    expect(lbGrpcServer.getSync(GrpcBindings.PORT)).to.be.eql(5050);
  });

  // LoopBack gRPC Service
  it('creates a grpc service which handles unary calls', async () => {
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(GreeterController);
    await app.start();

    // Make gRPC Client Unary Call
    const unaryResult: TestResponse = await promisifyUnaryCall({
      client: getGrpcClient(app),
      data: {name: 'World'},
    });
    expect(unaryResult.message).to.eql('Hello World');

    await app.stop();
  });

  // LoopBack gRPC Service
  it('creates a grpc service which handles client streaming calls', async () => {
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(GreeterController);
    await app.start();

    // Make gRPC Client Client Streaming Call
    const clientStreamingResult: TestResponse =
      await promisifyClientStreamingCall({
        client: getGrpcClient(app),
        data: [{name: 'Hello'}, {name: 'Big'}, {name: 'World'}],
      });
    expect(clientStreamingResult.message).to.eql('Hello Big World');

    await app.stop();
  });

  // LoopBack gRPC Service
  it('creates a grpc service which handles server streaming calls', async () => {
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(GreeterController);
    await app.start();

    // Make gRPC Client Server Streaming Call
    const serverStreamingResult: TestResponse[] =
      await promisifyServerStreamingCall({
        client: getGrpcClient(app),
        data: {name: 'Hello Big World'},
      });
    expect(serverStreamingResult).to.eql([
      {message: 'Hello'},
      {message: 'Big'},
      {message: 'World'},
    ]);

    await app.stop();
  });

  // LoopBack gRPC Service
  it('creates a grpc service which handles bidirectional streaming calls', async () => {
    // Load LoopBack Application
    const app: Application = givenApplication();
    app.controller(GreeterController);
    await app.start();

    // Make gRPC Client Bidi Streaming Call
    const bidiStreamingResult: TestResponse[] =
      await promisifyBibiStreamingCall({
        client: getGrpcClient(app),
        data: [{name: 'Hello'}, {name: 'World'}],
      });
    expect(bidiStreamingResult).to.eql([
      {message: 'Got Hello !'},
      {message: 'Got World !'},
    ]);

    await app.stop();
  });

  // LoopBack gRPC Service
  it('creates a grpc service with custom sequence', async () => {
    class MySequence extends GrpcSequence {
      async unaryCall<GrpcRequest, GrpcResponse>(
        call: ServerUnaryCall<GrpcRequest, GrpcResponse>,
      ): Promise<GrpcResponse> {
        const reply = await super.unaryCall<GrpcRequest, GrpcResponse>(call);
        (reply as unknown as TestResponse).message += ' Sequenced';
        return reply;
      }
    }

    // Load LoopBack Application
    const app: Application = givenApplication({sequence: MySequence});
    app.controller(GreeterController);
    await app.start();

    // Make gRPC Client Unary Call
    const result: TestResponse = await promisifyUnaryCall({
      client: getGrpcClient(app),
      data: {name: 'World'},
    });
    expect(result.message).to.eql('Hello World Sequenced');
    await app.stop();
  });

  // LoopBack gRPC Service
  it('creates a grpc service with tls', async () => {
    // Load LoopBack Application
    const app: Application = givenApplication({
      tls: {
        rootCertPath: join(process.cwd(), 'fixtures', 'cert', 'ca', 'grpc.crt'),
        keyCertPairPaths: [
          {
            privateKeyPath: join(
              process.cwd(),
              'fixtures',
              'cert',
              'server',
              'server.key',
            ),
            certChainPath: join(
              process.cwd(),
              'fixtures',
              'cert',
              'server',
              'server.crt',
            ),
          },
        ],
      },
    });
    app.controller(GreeterController);
    await app.start();

    try {
      const insecureResult = await promisifyUnaryCall({
        client: getGrpcClient(app),
        data: {name: 'World'},
      });
      expect(insecureResult).to.eql(null, 'Should never happen');
    } catch (e) {
      expect(e).to.have.property('code', 14);
    }

    // Make gRPC Client Unary Call
    // uncomment these two lines if you want to test mTLS call
    // but read README.md before
    // const tlsResult: TestResponse = await promisifyUnaryCall({
    //   client: getGrpcClient(app, {
    //     hostname: 'server.grpc.loopback.local',
    //     rootCerts: readFileSync(
    //       join(process.cwd(), 'fixtures', 'cert', 'ca', 'grpc.crt'),
    //     ),
    //   }),
    //   data: {name: 'World'},
    // });
    // expect(tlsResult.message).to.eql('Hello World');

    await app.stop();
  });

  // LoopBack gRPC Service
  it('creates a grpc service with mtls', async () => {
    // Load LoopBack Application
    const app: Application = givenApplication({
      tls: {
        rootCertPath: join(process.cwd(), 'fixtures', 'cert', 'ca', 'grpc.crt'),
        keyCertPairPaths: [
          {
            privateKeyPath: join(
              process.cwd(),
              'fixtures',
              'cert',
              'server',
              'server.key',
            ),
            certChainPath: join(
              process.cwd(),
              'fixtures',
              'cert',
              'server',
              'server.crt',
            ),
          },
        ],
        checkClientCertificate: true,
      },
    });
    app.controller(GreeterController);
    await app.start();

    try {
      const insecureResult = await promisifyUnaryCall({
        client: getGrpcClient(app),
        data: {name: 'World'},
      });
      expect(insecureResult).to.eql(null, 'Should never happen');
    } catch (e) {
      expect(e).to.have.property('code', 14);
    }

    // Make gRPC Client Unary Call
    // uncomment these two lines if you want to test mTLS call
    // but read README.md before
    // const mtlsResult: TestResponse = await promisifyUnaryCall({
    //   client: getGrpcClient(app, {
    //     hostname: 'server.grpc.loopback.local',
    //     rootCerts: readFileSync(
    //       join(process.cwd(), 'fixtures', 'cert', 'ca', 'grpc.crt'),
    //     ),
    //     privateKey: readFileSync(
    //       join(process.cwd(), 'fixtures', 'cert', 'client', 'client.key'),
    //     ),
    //     certChain: readFileSync(
    //       join(process.cwd(), 'fixtures', 'cert', 'client', 'client.crt'),
    //     ),
    //   }),
    //   data: {name: 'World'},
    // });
    // expect(mtlsResult.message).to.eql('Hello World');

    await app.stop();
  });
});

/**
 * Returns gRPC Enabled Application
 **/
function givenApplication(options?: {
  sequence?: Constructor<GrpcSequenceInterface>;
  tls?: Required<GrpcComponentConfig>['server']['tls'];
}): Application {
  const grpcConfig: GrpcComponentConfig = {
    server: {port: 5050, tls: options?.tls},
  };
  if (options?.sequence) {
    grpcConfig.sequence = options?.sequence;
  }
  const app = new Application({
    grpc: grpcConfig,
  });
  app.component(GrpcComponent);
  return app;
}

function getGrpcClient(
  app: Application,
  tls?:
    | {
        hostname: string;
        rootCerts: Buffer;
        privateKey?: never;
        certChain?: never;
      }
    | {
        hostname: string;
        rootCerts: Buffer;
        privateKey: Buffer;
        certChain: Buffer;
      },
): GreeterClient {
  if (!tls) {
    return new GreeterClient(
      `${app.getSync(GrpcBindings.HOST)}:${app.getSync(GrpcBindings.PORT)}`,
      ChannelCredentials.createInsecure(),
    );
  }
  return new GreeterClient(
    `${tls.hostname}:${app.getSync(GrpcBindings.PORT)}`,
    ChannelCredentials.createSsl(tls.rootCerts, tls.privateKey, tls.certChain),
  );
}

/**
 * Unary call to Promise Wrapper
 **/
async function promisifyUnaryCall(input: {
  client: GreeterClient;
  data: TestRequest;
}): Promise<TestResponse> {
  const client = input.client;
  return new Promise<TestResponse>((resolve, reject) =>
    client.unaryTest(
      input.data,
      (err: ServiceError | null, response: TestResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      },
    ),
  );
}

/**
 * Client streaming to Promise Wrapper
 **/
async function promisifyClientStreamingCall(input: {
  client: GreeterClient;
  data: TestRequest[];
}): Promise<TestResponse> {
  const client = input.client;
  return new Promise<TestResponse>((resolve, reject) => {
    const call = client.clientStreamTest(
      (err: ServiceError | null, response: TestResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      },
    );
    for (const chunk of input.data) {
      call.write(chunk);
    }
    call.end();
  });
}

/**
 * Server streaming to Promise Wrapper
 **/
async function promisifyServerStreamingCall(input: {
  client: GreeterClient;
  data: TestRequest;
}): Promise<TestResponse[]> {
  const client = input.client;
  return new Promise<TestResponse[]>((resolve, reject) => {
    const call = client.serverStreamTest(input.data);

    const chunks: TestResponse[] = [];
    call.on('data', (chunk: TestResponse) => {
      chunks.push(chunk);
    });
    call.on('end', () => resolve(chunks));
    call.on('error', reject);
  });
}

/**
 * Bidirectional streaming to Promise Wrapper
 **/
async function promisifyBibiStreamingCall(input: {
  client: GreeterClient;
  data: TestRequest[];
}): Promise<TestResponse[]> {
  const client = input.client;
  return new Promise<TestResponse[]>((resolve, reject) => {
    const call = client.bidiStreamTest();
    for (const chunk of input.data) {
      call.write(chunk);
    }
    call.end();

    const chunks: TestResponse[] = [];
    call.on('data', (chunk: TestResponse) => {
      chunks.push(chunk);
    });
    call.on('end', () => resolve(chunks));
    call.on('error', reject);
  });
}
