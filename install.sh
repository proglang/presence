#!/bin/sh
echo Installing App

docker-compose -f "docker-compose.yml" down
docker-compose -f "docker-compose.yml" up -d --build
chmod -R o+w ./image/api
