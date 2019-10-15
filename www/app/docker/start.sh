#!/bin/sh
echo "SETTING API Path to $API_PATH"
echo "SETTING APP Name to $APP_NAME"

cp /usr/share/nginx/html/config_default.js /usr/share/nginx/html/config.js
sed -i -e "s,___API_PATH___,$API_PATH,g" /usr/share/nginx/html/config.js
sed -i -e "s,___APP_NAME___,$APP_NAME,g" /usr/share/nginx/html/config.js

nginx -g 'daemon off;'