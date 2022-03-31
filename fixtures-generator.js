const GrpcGenerator = require('./dist/grpc.generator').GrpcGenerator;
const path = require('path');

function formatWithColor(message, color) {
  return `\x1b[${color}m${message}\x1b[0m`;
}

const fixturesProtoPath = path.join(
  process.cwd(),
  'src',
  '__tests__',
  'fixtures',
);

const clientGenerator = new GrpcGenerator({
  protoPattern: '**/fixtures/*.proto',
  tsOutOptions:
    'outputServices=grpc-js,lowerCaseServiceMethods=true,esModuleInterop=true,env=node',
  additionalArgs: '--experimental_allow_proto3_optional',
  tsOutputPath: path.join(fixturesProtoPath, 'client'),
  protoPath: path.join(process.cwd(), 'fixtures'),
  generate: true,
  load: false,
});

const serverGenerator = new GrpcGenerator({
  protoPattern: '**/fixtures/*.proto',
  additionalArgs: '--experimental_allow_proto3_optional',
  tsOutputPath: path.join(fixturesProtoPath, 'server'),
  protoPath: path.join(process.cwd(), 'fixtures'),
  generate: true,
  load: false,
});

console.log(formatWithColor('Generating proto.ts files from *.proto...', 33));
clientGenerator.execute();
serverGenerator.execute();
console.log(formatWithColor('All proto.ts files have been generated', 32));
