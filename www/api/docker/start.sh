#!/bin/sh

cd /var/www/html/
php artisan api:install

exec "$@"