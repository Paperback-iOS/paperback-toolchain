#!/bin/bash

rm -rf .generated/swift
mkdir -p .generated/swift

echo "Generating Swift Files"
protoc  --plugin='./plugins/protoc-gen-grpc-swift' --swift_opt='Visibility=Public' --swift_out='./.generated/swift' --grpc-swift_opt='Visibility=Public' --grpc-swift_out='./.generated/swift' ./protobuf/*.proto

echo "DONE"