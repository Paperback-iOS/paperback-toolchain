// package: 
// file: PDTLogger.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as PDTLogger_pb from "./PDTLogger_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IPaperbackLoggerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    streamLogs: IPaperbackLoggerService_IstreamLogs;
}

interface IPaperbackLoggerService_IstreamLogs extends grpc.MethodDefinition<PDTLogger_pb.LogFilter, PDTLogger_pb.LogLine> {
    path: "/PaperbackLogger/streamLogs";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<PDTLogger_pb.LogFilter>;
    requestDeserialize: grpc.deserialize<PDTLogger_pb.LogFilter>;
    responseSerialize: grpc.serialize<PDTLogger_pb.LogLine>;
    responseDeserialize: grpc.deserialize<PDTLogger_pb.LogLine>;
}

export const PaperbackLoggerService: IPaperbackLoggerService;

export interface IPaperbackLoggerServer extends grpc.UntypedServiceImplementation {
    streamLogs: grpc.handleServerStreamingCall<PDTLogger_pb.LogFilter, PDTLogger_pb.LogLine>;
}

export interface IPaperbackLoggerClient {
    streamLogs(request: PDTLogger_pb.LogFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTLogger_pb.LogLine>;
    streamLogs(request: PDTLogger_pb.LogFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTLogger_pb.LogLine>;
}

export class PaperbackLoggerClient extends grpc.Client implements IPaperbackLoggerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public streamLogs(request: PDTLogger_pb.LogFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTLogger_pb.LogLine>;
    public streamLogs(request: PDTLogger_pb.LogFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTLogger_pb.LogLine>;
}
