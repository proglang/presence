## Resources

### ExamLogResource

**_namespace:_** examlog

| name    | type   | note           |
| ------- | ------ | -------------- |
| id      | int    |                |
| text    | string |                |
| date    | int    | UNIX timestamp |
| user    | string | username       |
| history | int    | history count  |
| student | int    | student ID     |

### ExamLogHistoryResource

**_base:_** ExamLogResource

**_namespace:_** examlog

| name         | type                    | note |
| ------------ | ----------------------- | ---- |
| history.data | EXAM_LOG_HISTORY_DATA[] |      |

### ExamResource

**_namespace:_** exam

| name   | type             | note                   |
| ------ | ---------------- | ---------------------- |
| id     | int              |                        |
| text   | string           |                        |
| date   | int              | UNIX timestamp         |
| rights | EXAM_USER_RIGHTS | rights of current user |

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
| user    | string | username of user which changed presence status      |

### ExamUserResource

**_namespace:_** examuser

| name   | type             | note |
| ------ | ---------------- | ---- |
| id     | int              |      |
| name   | string           |      |
| email   | string           |      |
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
