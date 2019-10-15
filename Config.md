# Config

Standalone Configuration/Installation Guides are in the respective subdirectories(www/api; www/app).

## mysql

**_Read [MYSQL-Container Guide](https://hub.docker.com/_/mysql) for details\_**

## presence_api

### Environment Variables

| Key                                  | default    | Note                                                                                    |
| ------------------------------------ | ---------- | --------------------------------------------------------------------------------------- |
| APP_KEY\*                            |            | 32 Character Database Encryption Key                                                    |
| APP_DEBUG                            | false      | Debug Modus, adds more data to Error Messages. (This can also include passwords)        |
| JWT_SECRET\*                         |            | Token Secret: User Authentication Encryption Key                                        |
|                                      |            |                                                                                         |
| DB_CONNECTION\*                      |            | see [Laravel Database Documentation](https://laravel.com/docs/5.8/database) for details |
| DB_HOST\*                            |            | name of the mysql Container                                                             |
| DB_DATABASE\*                        |            | Database name of the API (=> same as MYSQL_DATABASE in mysql container)                 |
| DB_USERNAME\*                        |            | Database user (=> same as MYSQL_USER in mysql container)                                |
| DB_PASSWORD\*                        |            | Database user password (=> same as MYSQL_PASSWORD in mysql container )                  |
|                                      |            |                                                                                         |
| VALIDATE_PASSWORD_LENGTH             | 5          | Minimum Password Length                                                                 |
| VALIDATE_PASSWORD_LOWERCASE_COUNT    | 1          | Minimum Count of Lowercase Characters [a-z]                                             |
| VALIDATE_PASSWORD_UPPERCASE_COUNT    | 1          | Minimum Count of Uppercase Characters [A-Z]                                             |
| VALIDATE_PASSWORD_DIGIT_COUNT        | 1          | Minimum Count of Digits                                                                 |
| VALIDATE_PASSWORD_SPECIAL_COUNT      | 1          | Minimum Count of Special Characters                                                     |
| VALIDATE_PASSWORD_SPECIAL_CHARACTERS | @\$!%\*#?& | Allowed Special Characters                                                              |

## presence_app

### Environment Variables

| Key        | default | Note                                                  |
| ---------- | ------- | ----------------------------------------------------- |
| API_PATH\* |         | url to api                                            |
| APP_NAME   |         | name of the app visible in the top bar of the browser |

## nginx

- Config in ./image/nginx/default.conf

**_Read [NGINX-Container Guide](https://hub.docker.com/_/nginx) for more details\_**
