echo "SETTING API Path to $API_PATH"
sed -i -e "s,___API_PATH___,$API_PATH,g" /usr/share/nginx/html/config.js
nginx -g 'daemon off;'