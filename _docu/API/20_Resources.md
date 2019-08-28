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
