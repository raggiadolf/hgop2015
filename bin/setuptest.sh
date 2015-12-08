echo Removing containers from environment
echo
docker rm -f $(docker ps -aq)

echo Getting latest image from docker hub
echo
docker pull raggiadolf/tictactoe

echo Running the docker container
echo
docker run --name="tictactoe" -p 9000:8080 -d -e "NODE_ENV=production" raggiadolf/tictactoe
