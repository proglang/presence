# API

## Server Requirements

-   PHP >= 7.1.3
-   OpenSSL PHP Extension
-   PDO PHP Extension
-   Mbstring PHP Extension
-   MySQL, PostgreSQL or SQLite

## Installation

1. Create a new SQL Database
2. run _php artisan api:install_
3. **_Save the Application Key!_**  
   If you loose it you won't be able to access the encrypted data in the database anymore.

## Commands

| command     | description               |
| ----------- | ------------------------- |
| list        | Lists all commands        |
| api:list    | Lists all routes          |
| api:config  | create .env settings file |
| api:install | installs api              |

run commands with _php artisan \*command\*_ e.g. _php artisan list_

## Troubleshooting

-   Some Pages are not found
    -   Make sure mod_rewrite is enabled (Apache)
    -   <https://laravel.com/docs/5.8#web-server-configuration>
