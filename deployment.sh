sudo service docker start
docker push raggiadolf/tictactoe
echo "Docker image pushed to repo, sending setup script to test machine.\n"
ssh vagrant@$1 'bash -s' < setuptest.sh