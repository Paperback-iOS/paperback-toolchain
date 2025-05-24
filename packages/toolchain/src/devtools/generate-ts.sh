#!/bin/bash
cd "$(dirname "$0")"

rm -rf .generated/typescript
mkdir -p .generated/typescript

echo "Generating TS Files"

npx protoc \
  --ts_out $PWD/.generated/typescript \
  --ts_opt client_grpc1,ts_nocheck \
  --proto_path $PWD/protobuf $PWD/protobuf/*.proto

echo "Fixing ESM imports"

# Fix relative imports to include .js extensions using sed
find ./.generated/typescript \
-name "*.ts" -type f \
-exec sed -i '' 's/from "\.\([^"]*\)"/from ".\1.js"/g' {} \;

echo "DONE"
