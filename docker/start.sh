#!/bin/sh

cd /var/www/html/
composer install --no-dev --optimize-autoloader
php artisan migrate

exec "$@"