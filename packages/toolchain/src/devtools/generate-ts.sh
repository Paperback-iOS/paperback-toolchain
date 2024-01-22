#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# get the absolute path to the package dir
PACKAGE_DIR="$(realpath "${SCRIPT_DIR}/../..")"
DEVTOOLS_DIR="${PACKAGE_DIR}/src/devtools"

rm -rf "$DEVTOOLS_DIR/generated/typescript"
mkdir -p "$DEVTOOLS_DIR/generated/typescript"

PROTO_FILES=()
while IFS='' read -r line; do
  PROTO_FILES+=("$line")
done < <(find "${DEVTOOLS_DIR}/protobuf" -type f -name '*.proto')

echo "${PROTO_FILES[@]}"

echo "Generating TS Files"
npx \
  protoc \
  --ts_out "${DEVTOOLS_DIR}/generated/typescript" \
  --ts_opt client_grpc1 \
  --proto_path "${DEVTOOLS_DIR}/protobuf" \
  "${PROTO_FILES[@]}"

# npx grpc_tools_node_protoc \
# --js_out=import_style=commonjs,binary:./generated/typescript \
# --grpc_out=grpc_js:./generated/typescript \
# --plugin=protoc-gen-ts=./../../../../node_modules/.bin/protoc-gen-ts \
# --ts_out=grpc_js:./generated/typescript \
# -I ./protobuf \
# protobuf/*.proto

echo "DONE"
