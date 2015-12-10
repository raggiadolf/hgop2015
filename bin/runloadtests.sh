if [ "$1" == "" ]; then
  echo Please include ip of the server as a parameter
  exit 1
fi

echo Restarting docker instance on test machine
echo
ssh vagrant@192.168.50.4 'docker restart $(docker ps -q)'

echo Exporting URL to the Server
echo
export ACCEPTANCE_URL=http://$1

echo Running load tests
echo
grunt mochaTest:load
