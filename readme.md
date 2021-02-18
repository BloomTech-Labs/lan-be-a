## Lambda Alumni Network (LAN)

### Contributors
Team A Members
- Gerardo Rivera
- Jake Grella
- James Lundin
- Justin Marks
- Sal Zamora
- Yvette Luong

An app that allows Lambda School alums to connect and grow in their profession by providing career advice, job opportunities, and much more!

### Documentation
- [Product Canvas](https://docs.google.com/document/d/1-EyxKbikGrsTf08nTBxqso0zCdZ0HnKnJG7sbXu-d3s/edit?usp=sharing)
- [Trello Board](https://trello.com/b/NOH7uQ8q/lambda-alumni-network)
- [Design Files](https://projects.invisionapp.com/share/DRJBSR53VNS#/screens?browse)

### Tech Stack
`Express`
`PostgreSQL`
`React`

### Installation
Make sure you have [PostgreSQL](https://www.postgresql.org/) installed on your computer.
1. Clone the repository with `git clone`.

2. Install dependencies with `npm install`.

3. Create a `.env` file and set your environment variables (LinkedIn tokens will need to be provided).

4. Create a database in PostgreSQL.

5. Update `DATABASE`, `USER`, and `PASSWORD` in `.env` with your credentials.

6. Run the Knex migrations with `npx knex migrate:latest`.

7. Run the server with `npm run server`.

### Environment Variables
`SESSION_SECRET`
`DATABASE`
`USER`
`PASSWORD`
`LINKEDIN_CLIENT_ID`
`LINKEDIN_CLIENT_SECRET`
`LAN_TOKEN`


ENDPOINTS
Login/Logout endpoints
----------------------------------
API hosted at: https://lan-team-a-be.herokuapp.com/
### Auth Endpoints 
| Method| Endpoint            | Description                                        | Requirements
| ------| ------------------  | ---------------------------------------------------|--------------------------------------
| GET   | /api/auth/linkedin  | Uses linkedin and passport to verify user          | user must login with LinkedIn
| GET   | /api/auth/logout    | Logs out user by clearing the session client side  | 
 

# ALL LOGGED IN ENDPOINTS REQUESTS THE CLIENT MUST HAVE THE SESSION SAVED IN THEIR COOKIES
Admin Operations (REQUEST USER MUST BE ADMIN)
------------------------
API hosted at: https://lan-team-a-be.herokuapp.com/
### Admin Endpoints 
| Method | Endpoint                           | Description                       | Requirements
| ------ | -----------------------------------| ----------------------------------|-------------------
| PUT    | /api/admin/users/:user_id/:role_id | Updates a users role              | must be admin, user_id of user to be updated and new role_id in url params
| DELETE | /api/admin/users/:user_id          | Deletes users account             | must be admin, user to be deleted's id placed in url params
| POST   | /api/admin/roles/:role             | Add a new role to the roles table | must be admin, new role name in url params
| PUT    | /api/admin/:role_id/:role_name     | Update a role name in the db      | must be admin, role_id changing and new role name to be included in url as params
| DELETE | /api/admin/roles/:role_id          | Delete a role from roles table    | must be admin, role_id of role to be deleted to be placed in url params

Rooms CRUD
------------------------
API hosted at: https://lan-team-a-be.herokuapp.com/
### Rooms Endpoints 
| Method | Endpoint       | Description             | Requirements
| ------ | ---------------| ------------------------|-------------------
| GET    | /api/room/     | Get all rooms           | 
| POST   | /api/room/     | Create a new room       | Request user must be an admin, request body must include room_name
| DELETE | /api/room/:id  | Delete a specific room  | Request user must be an admin, room to delete in url as id param

User Operations
------------------------
API hosted at: https://lan-team-a-be.herokuapp.com/
### User Endpoints 
| Method | Endpoint                           | Description                                   | Requirements
| ------ | -----------------------------------| ----------------------------------------------|-------------------
| GET    | /api/user                          | Returns user info saved in session            | Session must exist on client side
| GET    | /api/user/:id                      | Get all posts and comments of a specific user | id of user the information is requested for must be in url params  
| GET    | /api/user/post/like                | Get all post likes the user has made          |  
| GET    | /api/user/comment/like             | Get all comment likes the user has made       |  
| PUT    | /api/user/displayname              | Update users display name                     | userID, displayName must be in request body
| PUT    | /api/user/track                    | Update users track                            | track, token must be in request body
| PUT    | /api/user/onboard                  | Sets a users onboarded field to true          |  
| DELETE | /api/user/settings/remove-user/:id | Deletes a user                                |

Post Operations
------------------------
API hosted at: https://lan-team-a-be.herokuapp.com/
### Post Endpoints 
| Method | Endpoint            | Description                           | Requirements
| ------ | --------------------| --------------------------------------|-------------------
| POST   | /api/post/create    | Creates a post and ties it to a room  | title, description, room_id must be in request body
| GET    | /api/post/:id       | Get a single specific post            | id of post must be in url params 
| POST   | /api/post/recent    | Get posts orded by most recent        | 
| POST   | /api/post/popular   | Get posts ordered by popularity       | 
| POST   | /api/post/search    | Search for posts with search string   | search must be in request body
| GET    | /api/post/like/:id  | Like a post                           | id of post must be in url params
| DELETE | /api/post/like/:id  | Unlike a post                         | id of post must be in url params


Comment Operations
------------------------
API hosted at: https://lan-team-a-be.herokuapp.com/
### Comment Endpoints 
| Method | Endpoint                  | Description                                 | Requirements
| ------ | --------------------------| --------------------------------------------|-------------------
| POST   | /api/comment/             | Creates a comment and ties it to a post     | postID, comment must be in request body
| GET    | /api/comment/recent/:id   | Fetch a post's comments by recent           | id of post fetching comments for must be in url params 
| GET    | /api/comment/popular/:id  | Fetch a post's comments by popular          | id of post fetching comments for must be in url params 
| GET    | /api/comment/like/:id     | Like a comment                              | id of comment to like in params of url
| DELETE | /api/comment/like/:id     | Delete a comment like                       | if of comment to remove like in params of url