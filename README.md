# API

## Server Requirements
* PHP >= 7.1.3
* OpenSSL PHP Extension
* PDO PHP Extension
* Mbstring PHP Extension
* MySQL, PostgreSQL or SQLite

## Installation
1. Create a new SQL Database
2. run *php artisan api:install*
3. ***Save the Application Key!*** \
If you loose it you won't be able to access the data in the database anymore.

## Commands
| command | description |
| --- |---|
| list | Lists all commands |
| api:list | Lists all routes |
| api:config | create .env settings file
| api:install | installs api

run commands with *php artisan \*command\** e.g. *php artisan list*

## Troubleshooting:
* Some Pages are not found
  * Make sure mod_rewrite is enabled (Apache)
  * https://laravel.com/docs/5.8#web-server-configuration