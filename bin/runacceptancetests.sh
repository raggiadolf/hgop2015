if [ "$1" == "" ]; then
  echo Please include ip of the server as a parameter
  exit 1
fi

echo Exporting URL to the Server
echo
export ACCEPTANCE_URL=http://$1

echo Running acceptance tests
echo
grunt mochaTest:acceptance