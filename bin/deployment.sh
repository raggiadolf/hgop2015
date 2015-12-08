if [ "$1" == "" ]; then
  echo Please include ip of the server as a parameter
  exit 1
fi

echo Starting the docker service
echo
sudo service docker start

echo Pushing the image to docker hub
echo
docker push raggiadolf/tictactoe

echo Docker image pushed to repo, sending setup script to test machine.
echo
ssh vagrant@$1 'bash -s' < bin/setuptest.sh
