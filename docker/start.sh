#!/bin/sh

cd /usr/share/nginx/html/
echo "SETTING API Path to $API_PATH"
sed -i -e "s,___API_PATH___,$API_PATH,g" config.js

exec "$@"

#nginx -g "daemon off;"