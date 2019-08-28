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
