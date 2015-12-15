echo Running revision $2 on port $1

echo Removing containers from environment
echo
docker rm -f tictactoe$2

echo Getting latest image from docker hub
echo
docker pull raggiadolf/tictactoe:$2

echo Running the docker container
echo
docker run -p $1:8080 -d --name tictactoe$2 -e "NODE_ENV=production" raggiadolf/tictactoe:$2
