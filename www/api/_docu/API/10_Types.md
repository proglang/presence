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
