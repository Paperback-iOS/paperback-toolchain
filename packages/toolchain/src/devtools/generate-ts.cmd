@echo off
setlocal enabledelayedexpansion

REM Get the directory of the script
set "SCRIPT_DIR=%~dp0"
for %%i in ("%SCRIPT_DIR:~0,-1%\..") do set "PACKAGE_DIR=%%~fi\.."
for %%i in ("%PACKAGE_DIR%") do set "PACKAGE_DIR=%%~fi"
set "DEVTOOLS_DIR=%PACKAGE_DIR%\src\devtools"

REM Remove the old generated typescript directory and create a new one
rd /s /q "%DEVTOOLS_DIR%\generated\typescript"
md "%DEVTOOLS_DIR%\generated\typescript"

REM Collect all .proto files
set "PROTO_FILES="
for /r "%DEVTOOLS_DIR%\protobuf" %%f in (*.proto) do (
    set "PROTO_FILES=!PROTO_FILES! %%f"
)

echo %PROTO_FILES%

echo Generating TS Files
call npm run protoc -- --ts_out "%DEVTOOLS_DIR%\generated\typescript" --ts_opt client_grpc1 --proto_path "%DEVTOOLS_DIR%\protobuf" %PROTO_FILES%

REM call npx grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./generated/typescript --grpc_out=grpc_js:./generated/typescript --plugin=protoc-gen-ts=./../../../../node_modules/.bin/protoc-gen-ts --ts_out=grpc_js:./generated/typescript -I ./protobuf protobuf/*.proto

echo DONE
