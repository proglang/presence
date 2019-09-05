#!/bin/sh

cd /var/www/html/
php artisan migrate

exec "$@"