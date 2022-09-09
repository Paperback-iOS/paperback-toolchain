// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var PDTSourceTester_pb = require('./PDTSourceTester_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_SourceInstallRequest(arg) {
  if (!(arg instanceof PDTSourceTester_pb.SourceInstallRequest)) {
    throw new Error('Expected argument of type SourceInstallRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SourceInstallRequest(buffer_arg) {
  return PDTSourceTester_pb.SourceInstallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SourceInstallResponse(arg) {
  if (!(arg instanceof PDTSourceTester_pb.SourceInstallResponse)) {
    throw new Error('Expected argument of type SourceInstallResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SourceInstallResponse(buffer_arg) {
  return PDTSourceTester_pb.SourceInstallResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SourceTestRequest(arg) {
  if (!(arg instanceof PDTSourceTester_pb.SourceTestRequest)) {
    throw new Error('Expected argument of type SourceTestRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SourceTestRequest(buffer_arg) {
  return PDTSourceTester_pb.SourceTestRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SourceTestResponse(arg) {
  if (!(arg instanceof PDTSourceTester_pb.SourceTestResponse)) {
    throw new Error('Expected argument of type SourceTestResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SourceTestResponse(buffer_arg) {
  return PDTSourceTester_pb.SourceTestResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaperbackSourceTesterService = exports.PaperbackSourceTesterService = {
  installSource: {
    path: '/PaperbackSourceTester/installSource',
    requestStream: false,
    responseStream: false,
    requestType: PDTSourceTester_pb.SourceInstallRequest,
    responseType: PDTSourceTester_pb.SourceInstallResponse,
    requestSerialize: serialize_SourceInstallRequest,
    requestDeserialize: deserialize_SourceInstallRequest,
    responseSerialize: serialize_SourceInstallResponse,
    responseDeserialize: deserialize_SourceInstallResponse,
  },
  testSource: {
    path: '/PaperbackSourceTester/testSource',
    requestStream: false,
    responseStream: true,
    requestType: PDTSourceTester_pb.SourceTestRequest,
    responseType: PDTSourceTester_pb.SourceTestResponse,
    requestSerialize: serialize_SourceTestRequest,
    requestDeserialize: deserialize_SourceTestRequest,
    responseSerialize: serialize_SourceTestResponse,
    responseDeserialize: deserialize_SourceTestResponse,
  },
};

exports.PaperbackSourceTesterClient = grpc.makeGenericClientConstructor(PaperbackSourceTesterService);
