# API - ReadMe

## Server Requirements

-   PHP >= 7.1.3
-   OpenSSL PHP Extension
-   PDO PHP Extension
-   Mbstring PHP Extension
-   MySQL, PostgreSQL or SQLite
-   composer (optional: Only needed if installed from git-repository)

## Installation

1. Create a new SQL Database
2. run `php artisan api:config`
3. **_Save the Application Key!_**  
   If you loose it you won't be able to access the encrypted data in the database anymore.
4. run `php artisan api:install`
5. Setup the Webserver to serve `./public` at the desired url e.g.: _`https://example.com/api`_.

**_or_**

1. Create a new SQL Database
2. ./install.sh
3. Setup the Webserver to serve `./public` at the desired url e.g.: _`https://example.com/api`_.

## Installation from git-repository

1. Create a new SQL Database
2. run `composer install --no-dev --optimize-autoloader`
3. run `php artisan api:config`
4. **_Save the Application Key!_**  
   If you loose it you won't be able to access the encrypted data in the database anymore.
5. run `php artisan api:install`
6. Setup the Webserver to serve `./public` at the desired url e.g.: _`https://example.com/api`_.

**_or_**

1. Create a new SQL Database
2. run `./install.sh -i`
3. Setup the Webserver to serve `./public` at the desired url e.g.: _`https://example.com/api`_.

## Commands

| command     | description               |
| ----------- | ------------------------- |
| list        | Lists all commands        |
| api:list    | Lists all routes          |
| api:config  | create .env settings file |
| api:install | installs api              |

run commands with `php artisan *command*` e.g. `php artisan list`

## Troubleshooting

-   Some Pages are not found
    -   Make sure mod_rewrite is enabled (Apache)
    -   <https://laravel.com/docs/5.8#web-server-configuration>

## References

-   <https://lumen.laravel.com/docs/5.8>
-   <https://laravel.com/docs/5.8/installation>

