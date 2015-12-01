#!/bin/bash

echo Cleaning...
rm -rf ./dist

echo Building app
grunt || exit $?

cp ./Dockerfile ./dist/

cd dist
npm install --production

echo Building docker image
docker build -t raggiadolf/tictactoe . || exit $?

echo "Done"
