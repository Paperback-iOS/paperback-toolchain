// package: 
// file: PDTLogger.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class LogLine extends jspb.Message { 
    getLevel(): LogLine.LogLevel;
    setLevel(value: LogLine.LogLevel): LogLine;
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): LogLine;
    addTags(value: string, index?: number): string;
    getMessage(): string;
    setMessage(value: string): LogLine;

    hasDate(): boolean;
    clearDate(): void;
    getDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setDate(value?: google_protobuf_timestamp_pb.Timestamp): LogLine;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogLine.AsObject;
    static toObject(includeInstance: boolean, msg: LogLine): LogLine.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogLine, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogLine;
    static deserializeBinaryFromReader(message: LogLine, reader: jspb.BinaryReader): LogLine;
}

export namespace LogLine {
    export type AsObject = {
        level: LogLine.LogLevel,
        tagsList: Array<string>,
        message: string,
        date?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }

    export enum LogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2,
    }

}

export class LogFilter extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogFilter.AsObject;
    static toObject(includeInstance: boolean, msg: LogFilter): LogFilter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogFilter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogFilter;
    static deserializeBinaryFromReader(message: LogFilter, reader: jspb.BinaryReader): LogFilter;
}

export namespace LogFilter {
    export type AsObject = {
    }
}
