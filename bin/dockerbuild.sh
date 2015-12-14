#!/bin/bash

export MOCHA_REPORTER=xunit
export MOCHA_REPORT=server-tests.xml

echo Cleaning...
rm -rf ./dist

echo Building app
grunt || exit $?

if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

cat > ./dist/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

cat > ./dist/public/version.html << _EOF_
<!doctype html>
<head>
   <title>TicTacToe version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GIT_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GIT_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

cp ./Dockerfile ./dist/

cd dist
npm install --production || exit $?

echo Building docker image
docker build -t raggiadolf/tictactoe:$GIT_COMMIT . || exit $?

echo "Done"
