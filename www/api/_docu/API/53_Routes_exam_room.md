### /exam/:eid/room

**_ All routes are authenticated_**

| type   | url                  | params           | return             | note |
| ------ | -------------------- | ---------------- | ------------------ | ---- |
| GET    | /exam/:eid/room      |                  | ExamRoomResource[] |      |
| POST   | /exam/:eid/room      | name, note, size | ExamRoomResource   |      |
| GET    | /exam/:eid/room/:rid |                  | ExamRoomResource   |      |
| PUT    | /exam/:eid/room/:rid | name, note, size | ExamRoomResource   |      |
| DELETE | /exam/:eid/room/:rid |                  |                    |      |

#### Args:

| name | type   | note    |
| ---- | ------ | ------- |
| name | string |         |
| note | string |         |
| eid  | int    | exam ID |
| rid  | int    | room ID |
