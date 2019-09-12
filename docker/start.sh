#!/bin/sh
while ! mysqladmin ping -h"$DB_HOST" --silent; do
    sleep 1
done

cd /var/www/html/
php artisan migrate

exec "$@"