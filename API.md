# API - Dev

## Commands

### Artisan

| command       | description               |
| ------------- | ------------------------- |
| list          | Lists all commands        |
| api:list      | Lists all routes          |
| api:config    | create .env settings file |
| api:install   | installs api              |
| api:docu      | creates documentation     |
| migrate:fresh | Drop and Create Database  |

run commands with `php artisan *command*` e.g. `php artisan list`

### Composer

| command                                | description                      |
| -------------------------------------- | -------------------------------- |
| install                                | install dependencies             |
| install --no-dev --optimize-autoloader | install dependencies             |
| dump-autoload                          | update autoload with new classes |

run commands with `composer *command*` e.g. `composer install`

### Other

| command            | description |
| ------------------ | ----------- |
| vendor/bin/phpunit | Run Tests   |

run commands with `*command*` e.g. `vendor/bin/phpunit`

## Types

### EXAM_USER_RIGHT

| note | r1               | r2                 | r3                 | r4              | r5                          |
| ---- | ---------------- | ------------------ | ------------------ | --------------- | --------------------------- |
|      | view             | update             | delete             |                 |                             |
|      | exam_viewuser    | exam_updateuser    | exam_deleteuser    | exam_adduser    |                             |
|      | exam_viewroom    | exam_updateroom    | exam_deleteroom    | exam_addroom    |                             |
|      | exam_viewstudent | exam_updatestudent | exam_deletestudent | exam_addstudent | exam_updatestudent_presence |
|      | exam_updatelog   | exam_viewlog       | exam_deletelog     | exam_addlog     |                             |

### EXAM_USER_RIGHTS

`[EXAM_USER_RIGHT=>boolean]`

### EXAM_LOG_HISTORY_DATA

| name | type   | note           |
| ---- | ------ | -------------- |
| id   | int    |                |
| text | string |                |
| user | string | username       |
| date | int    | UNIX timestamp |

## Resources

### ExamLogResource

**_namespace:_** examlog

| name    | type   | note           |
| ------- | ------ | -------------- |
| id      | int    |                |
| text    | string |                |
| date    | int    | UNIX timestamp |
| history | int    | history count  |
| student | int    | student ID     |

### ExamLogHistoryResource

**_base:_** ExamLogResource

**_namespace:_** examlog

| name         | type                  | note |
| ------------ | --------------------- | ---- |
| history.data | EXAM_LOG_HISTORY_DATA |      |

### ExamResource

**_namespace:_** exam

| name | type   | note           |
| ---- | ------ | -------------- |
| id   | int    |                |
| text | string |                |
| date | int    | UNIX timestamp |

### ExamRoomResource

**_namespace:_** examroom

| name | type   | note |
| ---- | ------ | ---- |
| id   | int    |      |
| name | string |      |
| note | string |      |
| size | int    |      |

### ExamStudentResource

**_namespace:_** examstudent

| name    | type   | note                 |
| ------- | ------ | -------------------- |
| id      | int    |                      |
| name    | string |                      |
| ident   | string | matriculation number |
| present | bool   |                      |

### ExamUserResource

**_namespace:_** examuser

| name   | type             | note |
| ------ | ---------------- | ---- |
| id     | int              |      |
| name   | string           |      |
| note   | string           |      |
| rights | EXAM_USER_RIGHTS |      |

### UserResource

**_namespace:_** user

| name  | type   | note |
| ----- | ------ | ---- |
| id    | int    |      |
| name  | string |      |
| email | string |      |

### ErrorResource

**_namespace:_** -

**_member:_**

| name       | type             | note |
| ---------- | ---------------- | ---- |
| error      | ERROR_IDENT[]    |      |
| error.msg  | string[]         |      |
| error.args | ERROR_IDENT_ARGS |      |

### AuthenticationResource

**_namespace:_** -

**_member:_**

| name | type   | note           |
| ---- | ------ | -------------- |
| auth | string | JSON Web Token |

## Errors

## Routes

**_Notes:_**

-   All routes can return an authentication header
-   All routes can return an AuthenticationResource
-   All routes can return an Error Resource

### /user

| type   | url             | params                | return       | authenticated | note |
| ------ | --------------- | --------------------- | ------------ | ------------- | ---- |
| POST   | /user/login     | email, password       | UserResource | n             |      |
| POST   | /user/login/jwt |                       | UserResource | y             |      |
| POST   | /user/register  | email, name, password | UserResource | n             |      |
| GET    | /user/logout    |                       |              | y             |      |
| GET    | /user           |                       | UserResource | y             |      |
| DELETE | /user           |                       |              | y             |      |

#### Args:

| name     | type   | note |
| -------- | ------ | ---- |
| email    | string |      |
| name     | string |      |
| password | string |      |

### /exam

**_ All routes are authenticated_**

| type   | url        | params     | return         | note |
| ------ | ---------- | ---------- | -------------- | ---- |
| GET    | /exam      |            | ExamResource[] |      |
| POST   | /exam      | name, date | ExamResource   |      |
| GET    | /exam/:eid |            | ExamResource   |      |
| PUT    | /exam/:eid | name, date | ExamResource   |      |
| DELETE | /exam/:eid |            |                |      |

#### Args:

| name | type   | note           |
| ---- | ------ | -------------- |
| date | int    | UNIX timestamp |
| name | string |                |
| eid  | int    |                |

### /exam/:eid/log

**_ All routes are authenticated_**

| type   | url                 | params | return            | note |
| ------ | ------------------- | ------ | ----------------- | ---- |
| GET    | /exam/:eid/log      | view?  | ExamLogResource[] |      |
| POST   | /exam/:eid/log      | text   | ExamLogResource   |      |
| POST   | /exam/:eid/log/:sid | text   | ExamLogResource   |      |
| GET    | /exam/:eid/log/:lid |        | ExamLogResource   |      |
| PUT    | /exam/:eid/log/:lid | text   | ExamLogResource   |      |
| DELETE | /exam/:eid/log/:lid |        |                   |      |

#### Args:

| name | type   | note                     |
| ---- | ------ | ------------------------ |
| view | string | values: "all", "deleted" |
| text | string |                          |
| eid  | int    | exam ID                  |
| lid  | int    | log ID                   |
| sid  | int    | student ID               |

### /exam/:eid/room

**_ All routes are authenticated_**

| type   | url                  | params           | return             | note |
| ------ | -------------------- | ---------------- | ------------------ | ---- |
| GET    | /exam/:eid/room      |                  | ExamRoomResource[] |      |
| POST   | /exam/:eid/room      | name, note, size | ExamRoomResource   |      |
| GET    | /exam/:eid/room/:rid |                  | ExamRoomResource   |      |
| PUT    | /exam/:eid/room/:rid | name, note, size | ExamRoomResource   |      |
| DELETE | /exam/:eid/room/:rid |                  |                    |      |

#### Args:

| name | type   | note    |
| ---- | ------ | ------- |
| name | string |         |
| note | string |         |
| eid  | int    | exam ID |
| rid  | int    | room ID |

### /exam/:eid/student

**_ All routes are authenticated_**

| type   | url                             | params      | return                | note |
| ------ | ------------------------------- | ----------- | --------------------- | ---- |
| GET    | /exam/:eid/student              |             | ExamStudentResource[] |      |
| POST   | /exam/:eid/student              | name, ident | ExamStudentResource   |      |
| GET    | /exam/:eid/student/:sid         |             | ExamStudentResource   |      |
| PUT    | /exam/:eid/student/:sid         | name, ident | ExamStudentResource   |      |
| PUT    | /exam/:eid/student/:sid/present | val         | ExamStudentResource   |      |
| DELETE | /exam/:eid/student/:sid         |             |                       |      |

#### Args:

| name  | type   | note                 |
| ----- | ------ | -------------------- |
| name  | string |                      |
| ident | string | matriculation number |
| val   | string |                      |
| eid   | int    | exam ID              |
| sid   | int    | student ID           |

### /exam/:eid/user

**_ All routes are authenticated_**

| type   | url                  | params              | return                | note |
| ------ | -------------------- | ------------------- | --------------------- | ---- |
| GET    | /exam/:eid/user      |                     | ExamStudentResource[] |      |
| POST   | /exam/:eid/user      | note, rights, email | ExamStudentResource   |      |
| GET    | /exam/:eid/user/:uid |                     | ExamStudentResource   |      |
| PUT    | /exam/:eid/user/:uid | note, rights        | ExamStudentResource   |      |
| DELETE | /exam/:eid/user/:uid |                     |                       |      |

#### Args:

| name   | type             | note    |
| ------ | ---------------- | ------- |
| note   | string           |         |
| email  | string           |         |
| rights | EXAM_USER_RIGHTS |         |
| eid    | int              | exam ID |
| uid    | int              | user ID |

