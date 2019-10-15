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
