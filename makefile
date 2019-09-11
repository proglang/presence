all:
	sudo docker-compose -f "docker-compose.yml" up -d --build
	sudo chown www-data:www-data ./image/api
