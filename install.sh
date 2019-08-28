#!/bin/bash

usage() { echo "Usage: $0 [-i]" 1>&2; exit 1; }

install=0
while getopts ":i:" opt; do
  case $OPTARG in
    i) install=1
    ;;
    *) usage
    ;;
  esac
done

printf "Argument install is %s\n" "$install"
if [ $install == 1 ]
then
    composer install --no-dev --optimize-autoloader
fi
php artisan api:config
php artisan api:install