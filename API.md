#API

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

| command       | description                      |
| ------------- | -------------------------------- |
| install       | install dependencies             |
| dump-autoload | update autoload with new classes |

run commands with `composer *command*` e.g. `composer install`

### Other

| command            | description |
| ------------------ | ----------- |
| vendor/bin/phpunit | Run Tests   |

run commands with `*command*` e.g. `vendor/bin/phpunit`

## Resources

### ExamLogResource

**_namespace:_** examlog

**member**

-   id: int
-   text: string
-   date:
-   history:
-   student: int

### ExamLogHistoryResource

**_namespace:_** examlog

**_base:_** ExamLogResource

**member**

-   history.data: []
    -   id: int
    -   text: string
    -   user: ['id':int, 'name': string]
    -   date:

### ExamResource

**_namespace:_** exam

**_member:_**

-   id: int -> user ID
-   name: string -> exam Name
-   date:

### ExamRoomResource

**_namespace:_** examroom

**_member:_**

-   id: int -> user ID
-   name: string -> room Name
-   note: string
-   size: int

### ExamStudentResource

**_namespace:_** examstudent

**_member:_**

-   id: int -> user ID
-   name: string -> room Name
-   ident: string
-   present: bool

### ExamUserResource

**_namespace:_** examuser

**_member:_**

-   id: int -> user ID
-   name: string -> room Name
-   note: string
-   rights: {[key:string]=value:bool}

### UserResource

**_namespace:_** user

**_member:_**

-   id: int -> user ID
-   name: string -> user Name
-   email: string -> user EMail

### Error

**_namespace:_** -

**_member:_**

-   error: string[] -> error identifier list
-   error.msg: string[] -> human readable error messages
-   error.args: {[key]=value} -> arguments

## Errors

## Routes

**_Notes:_**

-   All routes can return an authentication header
-   All routes can return an Error Resource

### POST /user/login

**_POST Parameters:_**

-   email: string ->
-   password: string ->

**_returns:_** UserResource

### POST /user/register

**_POST Parameters:_**

-   email: string ->
-   name: string ->
-   password: string ->

**_returns:_** UserResource

### POST /user/verify/{ID:int}

**_GET Parameters:_**

-   ID: int -> user ID

**_POST Parameters:_**

-   name: string ->
-   password: string ->

**_returns:_** UserResource

### GET /user

**_returns:_** UserResource

### GET /user/logout

**_returns:_** -

### GET /user/refresh

**_returns:_** -

### POST /exam

**_POST Parameters:_**

-   name: string ->
-   date: string ->

**_returns:_** ExamResource

### GET /exam

**_returns:_** ExamResource[]

### PUT /exam/{ID:int}

**_GET Parameters:_**

-   ID: int -> exam ID

**_POST Parameters:_**

-   name: string ->
-   date: string ->

**_returns:_** ExamResource

### GET /exam/{ID:int}

**_GET Parameters:_**

-   ID: int -> exam ID

**_returns:_** ExamResource

### DELETE /exam/{ID:int}

**_GET Parameters:_**

-   ID: int -> exam ID

**_returns:_** -

### POST /exam/{ID:int}/log

### POST /exam/{ID:int}/log/{studentID:int}

### GET /exam/{ID:int}/log

### PUT /exam/{ID:int}/log/{ID:int}

### GET /exam/{ID:int}/log/{ID:int}

### DELETE /exam/{ID:int}/log/{ID:int}

### POST /exam/{ID:int}/room

### GET /exam/{ID:int}/room

### PUT /exam/{ID:int}/room/{ID:int}

### GET /exam/{ID:int}/room/{ID:int}

### DELETE /exam/{ID:int}/room/{ID:int}

### POST /exam/{ID:int}/student

### GET /exam/{ID:int}/student

### PUT /exam/{ID:int}/student/{ID:int}

### PUT /exam/{ID:int}/student/{ID:int}/present

### GET /exam/{ID:int}/student/{ID:int}

### DELETE /exam/{ID:int}/student/{ID:int}

### POST /exam/{ID:int}/user

### GET /exam/{ID:int}/user

### PUT /exam/{ID:int}/user/{ID:int}

### GET /exam/{ID:int}/user/{ID:int}

### DELETE /exam/{ID:int}/user/{ID:int}

