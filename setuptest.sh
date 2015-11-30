docker kill tictactoe
docker rm tictactoe
docker pull raggiadolf/tictactoe
docker run --name="tictactoe" -p 9001:8080 -d -e "NODE_ENV=production" raggiadolf/tictactoe