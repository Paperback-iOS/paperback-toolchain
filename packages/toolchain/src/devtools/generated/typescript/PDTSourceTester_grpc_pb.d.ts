// package: 
// file: PDTSourceTester.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as PDTSourceTester_pb from "./PDTSourceTester_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IPaperbackSourceTesterService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    installSource: IPaperbackSourceTesterService_IinstallSource;
    testSource: IPaperbackSourceTesterService_ItestSource;
}

interface IPaperbackSourceTesterService_IinstallSource extends grpc.MethodDefinition<PDTSourceTester_pb.SourceInstallRequest, PDTSourceTester_pb.SourceInstallResponse> {
    path: "/PaperbackSourceTester/installSource";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<PDTSourceTester_pb.SourceInstallRequest>;
    requestDeserialize: grpc.deserialize<PDTSourceTester_pb.SourceInstallRequest>;
    responseSerialize: grpc.serialize<PDTSourceTester_pb.SourceInstallResponse>;
    responseDeserialize: grpc.deserialize<PDTSourceTester_pb.SourceInstallResponse>;
}
interface IPaperbackSourceTesterService_ItestSource extends grpc.MethodDefinition<PDTSourceTester_pb.SourceTestRequest, PDTSourceTester_pb.SourceTestResponse> {
    path: "/PaperbackSourceTester/testSource";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<PDTSourceTester_pb.SourceTestRequest>;
    requestDeserialize: grpc.deserialize<PDTSourceTester_pb.SourceTestRequest>;
    responseSerialize: grpc.serialize<PDTSourceTester_pb.SourceTestResponse>;
    responseDeserialize: grpc.deserialize<PDTSourceTester_pb.SourceTestResponse>;
}

export const PaperbackSourceTesterService: IPaperbackSourceTesterService;

export interface IPaperbackSourceTesterServer extends grpc.UntypedServiceImplementation {
    installSource: grpc.handleUnaryCall<PDTSourceTester_pb.SourceInstallRequest, PDTSourceTester_pb.SourceInstallResponse>;
    testSource: grpc.handleServerStreamingCall<PDTSourceTester_pb.SourceTestRequest, PDTSourceTester_pb.SourceTestResponse>;
}

export interface IPaperbackSourceTesterClient {
    installSource(request: PDTSourceTester_pb.SourceInstallRequest, callback: (error: grpc.ServiceError | null, response: PDTSourceTester_pb.SourceInstallResponse) => void): grpc.ClientUnaryCall;
    installSource(request: PDTSourceTester_pb.SourceInstallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: PDTSourceTester_pb.SourceInstallResponse) => void): grpc.ClientUnaryCall;
    installSource(request: PDTSourceTester_pb.SourceInstallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: PDTSourceTester_pb.SourceInstallResponse) => void): grpc.ClientUnaryCall;
    testSource(request: PDTSourceTester_pb.SourceTestRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTSourceTester_pb.SourceTestResponse>;
    testSource(request: PDTSourceTester_pb.SourceTestRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTSourceTester_pb.SourceTestResponse>;
}

export class PaperbackSourceTesterClient extends grpc.Client implements IPaperbackSourceTesterClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public installSource(request: PDTSourceTester_pb.SourceInstallRequest, callback: (error: grpc.ServiceError | null, response: PDTSourceTester_pb.SourceInstallResponse) => void): grpc.ClientUnaryCall;
    public installSource(request: PDTSourceTester_pb.SourceInstallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: PDTSourceTester_pb.SourceInstallResponse) => void): grpc.ClientUnaryCall;
    public installSource(request: PDTSourceTester_pb.SourceInstallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: PDTSourceTester_pb.SourceInstallResponse) => void): grpc.ClientUnaryCall;
    public testSource(request: PDTSourceTester_pb.SourceTestRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTSourceTester_pb.SourceTestResponse>;
    public testSource(request: PDTSourceTester_pb.SourceTestRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<PDTSourceTester_pb.SourceTestResponse>;
}
