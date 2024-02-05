#!/bin/bash
cd "$(dirname "$0")"

rm -rf .generated/typescript
mkdir -p .generated/typescript

echo "Generating TS Files"

npx protoc \
--ts_out $PWD/.generated/typescript \
--ts_opt client_grpc1 \
--proto_path $PWD/protobuf $PWD/protobuf/*.proto

echo "DONE"