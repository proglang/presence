# exam_api
## Resources
### UserResource

***namespace:*** user
***member:***
* id: int -> user ID
* name: string -> user Name
* email: string -> user EMail

### Error
***namespace:*** -
***member:***
* error: string[] -> error identifier list
* error.msg: string[] -> human readable error messages
* error.args: {[key]=value} -> arguments

## Routes
***Notes:***
* All routes can return an authentication header

### Non Authenticated
#### POST /user/login
***POST Parameters:***
* email: string ->
* password: string ->
***returns:***
UserResource|Error

#### POST /user/register
***POST Parameters:***
* email: string ->
* name: string ->
* password: string ->
***returns:***
UserResource|Error


#### POST /user/verify/{ID:int}
***POST Parameters:***
* name: string ->
* password: string ->
***returns:***
UserResource|Error

#### GET  /user/verify/{ID:int}/{TOKEN:string}
***POST Parameters:***
* name: string ->
* password: string ->
***GET Parameters:***
* ID: int -> user ID
* TOKEN: string -> verification Token
***returns:***
UserResource|Error

### Authenticated
#### GET /user
***returns:***
UserResource|Error
#### GET /user/logout
***returns:***
none|Error
#### GET /user/refresh
***returns:***
none|Error

#### POST /exam
#### GET  /exam
#### PUT  /exam/{ID:int}
#### GET  /exam/{ID:int}
#### DELETE /exam/{ID:int}

#### POST /exam/{ID:int}/user
#### GET  /exam/{ID:int}/user
#### PUT  /exam/{ID:int}/user/{ID:int}
#### GET  /exam/{ID:int}/user/{ID:int}
#### DELETE /exam/{ID:int}/user/{ID:int}

#### POST /exam/{ID:int}/room
#### GET  /exam/{ID:int}/room
#### PUT  /exam/{ID:int}/room/{ID:int}
#### GET  /exam/{ID:int}/room/{ID:int}
#### DELETE /exam/{ID:int}/room/{ID:int}

#### POST /exam/{ID:int}/student
#### GET  /exam/{ID:int}/student
#### PUT  /exam/{ID:int}/student/{ID:int}
#### GET  /exam/{ID:int}/student/{ID:int}
#### DELETE /exam/{ID:int}/student/{ID:int}

#### POST /exam/{ID:int}/log
#### POST /exam/{ID:int}/log/{studentID:int}
#### GET  /exam/{ID:int}/log