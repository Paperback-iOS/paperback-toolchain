// package: 
// file: PDTSourceTester.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class SourceInstallRequest extends jspb.Message { 
    getSourceid(): string;
    setSourceid(value: string): SourceInstallRequest;
    getRepobaseurl(): string;
    setRepobaseurl(value: string): SourceInstallRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SourceInstallRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SourceInstallRequest): SourceInstallRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SourceInstallRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SourceInstallRequest;
    static deserializeBinaryFromReader(message: SourceInstallRequest, reader: jspb.BinaryReader): SourceInstallRequest;
}

export namespace SourceInstallRequest {
    export type AsObject = {
        sourceid: string,
        repobaseurl: string,
    }
}

export class SourceInstallResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SourceInstallResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SourceInstallResponse): SourceInstallResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SourceInstallResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SourceInstallResponse;
    static deserializeBinaryFromReader(message: SourceInstallResponse, reader: jspb.BinaryReader): SourceInstallResponse;
}

export namespace SourceInstallResponse {
    export type AsObject = {
    }

    export enum Status {
    SUCCESS = 0,
    FAILURE = 2,
    }

}

export class SourceTestRequest extends jspb.Message { 
    getSourceid(): string;
    setSourceid(value: string): SourceTestRequest;

    hasData(): boolean;
    clearData(): void;
    getData(): SourceTestRequest.TestData | undefined;
    setData(value?: SourceTestRequest.TestData): SourceTestRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SourceTestRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SourceTestRequest): SourceTestRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SourceTestRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SourceTestRequest;
    static deserializeBinaryFromReader(message: SourceTestRequest, reader: jspb.BinaryReader): SourceTestRequest;
}

export namespace SourceTestRequest {
    export type AsObject = {
        sourceid: string,
        data?: SourceTestRequest.TestData.AsObject,
    }


    export class TestData extends jspb.Message { 

        hasMangaid(): boolean;
        clearMangaid(): void;
        getMangaid(): string | undefined;
        setMangaid(value: string): TestData;

        hasChapterid(): boolean;
        clearChapterid(): void;
        getChapterid(): string | undefined;
        setChapterid(value: string): TestData;

        hasUpdatetime(): boolean;
        clearUpdatetime(): void;
        getUpdatetime(): google_protobuf_timestamp_pb.Timestamp | undefined;
        setUpdatetime(value?: google_protobuf_timestamp_pb.Timestamp): TestData;

        hasSearchdata(): boolean;
        clearSearchdata(): void;
        getSearchdata(): SourceTestRequest.TestData.SearchData | undefined;
        setSearchdata(value?: SourceTestRequest.TestData.SearchData): TestData;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): TestData.AsObject;
        static toObject(includeInstance: boolean, msg: TestData): TestData.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: TestData, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): TestData;
        static deserializeBinaryFromReader(message: TestData, reader: jspb.BinaryReader): TestData;
    }

    export namespace TestData {
        export type AsObject = {
            mangaid?: string,
            chapterid?: string,
            updatetime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
            searchdata?: SourceTestRequest.TestData.SearchData.AsObject,
        }


        export class SearchData extends jspb.Message { 

            hasQuery(): boolean;
            clearQuery(): void;
            getQuery(): string | undefined;
            setQuery(value: string): SearchData;
            clearIncludedtagsList(): void;
            getIncludedtagsList(): Array<string>;
            setIncludedtagsList(value: Array<string>): SearchData;
            addIncludedtags(value: string, index?: number): string;
            clearExcludedtagsList(): void;
            getExcludedtagsList(): Array<string>;
            setExcludedtagsList(value: Array<string>): SearchData;
            addExcludedtags(value: string, index?: number): string;

            hasItemindex(): boolean;
            clearItemindex(): void;
            getItemindex(): string | undefined;
            setItemindex(value: string): SearchData;

            hasItemid(): boolean;
            clearItemid(): void;
            getItemid(): string | undefined;
            setItemid(value: string): SearchData;

            serializeBinary(): Uint8Array;
            toObject(includeInstance?: boolean): SearchData.AsObject;
            static toObject(includeInstance: boolean, msg: SearchData): SearchData.AsObject;
            static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
            static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
            static serializeBinaryToWriter(message: SearchData, writer: jspb.BinaryWriter): void;
            static deserializeBinary(bytes: Uint8Array): SearchData;
            static deserializeBinaryFromReader(message: SearchData, reader: jspb.BinaryReader): SearchData;
        }

        export namespace SearchData {
            export type AsObject = {
                query?: string,
                includedtagsList: Array<string>,
                excludedtagsList: Array<string>,
                itemindex?: string,
                itemid?: string,
            }
        }

    }

}

export class SourceTestResponse extends jspb.Message { 
    getTestcase(): string;
    setTestcase(value: string): SourceTestResponse;
    getCompletetime(): number;
    setCompletetime(value: number): SourceTestResponse;
    clearFailuresList(): void;
    getFailuresList(): Array<string>;
    setFailuresList(value: Array<string>): SourceTestResponse;
    addFailures(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SourceTestResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SourceTestResponse): SourceTestResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SourceTestResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SourceTestResponse;
    static deserializeBinaryFromReader(message: SourceTestResponse, reader: jspb.BinaryReader): SourceTestResponse;
}

export namespace SourceTestResponse {
    export type AsObject = {
        testcase: string,
        completetime: number,
        failuresList: Array<string>,
    }
}
