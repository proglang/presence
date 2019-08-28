### /user

| type   | url             | params                | return       | authenticated | note |
| ------ | --------------- | --------------------- | ------------ | ------------- | ---- |
| POST   | /user/login     | email, password       | UserResource | n             |      |
| POST   | /user/login/jwt |                       | UserResource | y             |      |
| POST   | /user/register  | email, name, password | UserResource | n             |      |
| GET    | /user/logout    |                       |              | y             |      |
| GET    | /user           |                       | UserResource | y             |      |
| DELETE | /user           |                       |              | y             |      |

#### Args:

| name     | type   | note |
| -------- | ------ | ---- |
| email    | string |      |
| name     | string |      |
| password | string |      |
