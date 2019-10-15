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
