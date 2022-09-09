// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var PDTLogger_pb = require('./PDTLogger_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_LogFilter(arg) {
  if (!(arg instanceof PDTLogger_pb.LogFilter)) {
    throw new Error('Expected argument of type LogFilter');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_LogFilter(buffer_arg) {
  return PDTLogger_pb.LogFilter.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_LogLine(arg) {
  if (!(arg instanceof PDTLogger_pb.LogLine)) {
    throw new Error('Expected argument of type LogLine');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_LogLine(buffer_arg) {
  return PDTLogger_pb.LogLine.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaperbackLoggerService = exports.PaperbackLoggerService = {
  streamLogs: {
    path: '/PaperbackLogger/streamLogs',
    requestStream: false,
    responseStream: true,
    requestType: PDTLogger_pb.LogFilter,
    responseType: PDTLogger_pb.LogLine,
    requestSerialize: serialize_LogFilter,
    requestDeserialize: deserialize_LogFilter,
    responseSerialize: serialize_LogLine,
    responseDeserialize: deserialize_LogLine,
  },
};

exports.PaperbackLoggerClient = grpc.makeGenericClientConstructor(PaperbackLoggerService);
