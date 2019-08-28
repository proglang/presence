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
