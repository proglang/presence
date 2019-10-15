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
