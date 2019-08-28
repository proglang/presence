## Installation

1. Create a new SQL Database
2. run `php artisan api:config`
3. **_Save the Application Key!_**  
   If you loose it you won't be able to access the encrypted data in the database anymore.
4. run `php artisan api:install`
5. Setup the Webserver to serve `./public` at the desired url e.g.: _`https://example.com/api`_.
