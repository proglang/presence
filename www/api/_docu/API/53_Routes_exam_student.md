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
