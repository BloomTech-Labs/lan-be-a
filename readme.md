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

3. Create a `.env` file and set your environment variables (LinkedIn tokens will need to be provided). It should look like this:

   1. "DATABASE" should be the name you give your **_database_** (not your server) in pgAdmin
   2. "USER" should match the "username" when you create your database
   3. "PASSWORD" should match the password for your database

```
DATABASE=yourdatabase
USER=youruser
PASSWORD=yourpassword
LAN_TOKEN=anythinggoeshere
SESSION_SECRET=bagelsinthewind
LINKEDIN_CLIENT_ID=786t2e05bh0c2d
LINKEDIN_CLIENT_SECRET=P6uAEw94o9jNOMaE
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

4. Create a database in PostgreSQL (and make sure you have pgAdmin).cd

5. Update `DATABASE`, `USER`, `PASSWORD`, `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` and `CLOUDINARY_UPLOAD_PRESET` in `.env` with your credentials.

6. Run the Knex migrations with `npx knex migrate:latest`.

7. Run the Knex seeds with `npx knex seed:run`.

8. Run the server with `npm run server`.

9. In pgAdmin, find the query tool and set your role to admin with:

```sql
update users set role_id = 3 where id='your_user_id'
```

### Environment Variables

`SESSION_SECRET`
`DATABASE`
`USER`
`PASSWORD`
`LINKEDIN_CLIENT_ID`
`LINKEDIN_CLIENT_SECRET`
`LAN_TOKEN`

### If encountering prettier/eslint errors run script in terminal:

`npm run lint`

ENDPOINTS
Login/Logout endpoints

---

API hosted at: https://lan-team-a-be.herokuapp.com/

### Auth Endpoints

| Method | Endpoint           | Description                                       | Requirements                  |
| ------ | ------------------ | ------------------------------------------------- | ----------------------------- |
| GET    | /api/auth/linkedin | Uses linkedin and passport to verify user         | user must login with LinkedIn |
| GET    | /api/auth/redirect | Redirects to FE after successful Linkedin login   | to be setup in Linkedin       |
| GET    | /api/auth/logout   | Logs out user by clearing the session client side |

# ALL LOGGED IN ENDPOINTS REQUESTS THE CLIENT MUST HAVE THE SESSION SAVED IN THEIR COOKIES

## Admin Operations (REQUEST USER MUST BE ADMIN)

API hosted at: https://lan-team-a-be.herokuapp.com/

### Admin Endpoints

| Method | Endpoint                           | Description                       | Requirements                                                                      |
| ------ | ---------------------------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| GET    | /api/admin/users/                  | Updates a users role              | must be admin, user_id of user to be updated and new role_id in url params        |
| PUT    | /api/admin/users/:user_id/:role_id | Updates a users role              | must be admin, user_id of user to be updated and new role_id in url params        |
| DELETE | /api/admin/users/:user_id          | Deletes users account             | must be admin, user to be deleted's id placed in url params                       |
| POST   | /api/admin/roles/:role             | Add a new role to the roles table | must be admin, new role name in url params                                        |
| PUT    | /api/admin/:role_id/:role_name     | Update a role name in the db      | must be admin, role_id changing and new role name to be included in url as params |
| DELETE | /api/admin/roles/:role_id          | Delete a role from roles table    | must be admin, role_id of role to be deleted to be placed in url params           |

## Rooms CRUD

API hosted at: https://lan-team-a-be.herokuapp.com/

### Rooms Endpoints

| Method | Endpoint      | Description            | Requirements                                                       |
| ------ | ------------- | ---------------------- | ------------------------------------------------------------------ |
| GET    | /api/room/    | Get all rooms          |
| POST   | /api/room/    | Create a new room      | Request user must be an admin, request body must include room_name |
| DELETE | /api/room/:id | Delete a specific room | Request user must be an admin, room to delete in url as id param   |

## User Operations

API hosted at: https://lan-team-a-be.herokuapp.com/

### User Endpoints

| Method | Endpoint                           | Description                                   | Requirements                                                      |
| ------ | ---------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| GET    | /api/user                          | Returns user info saved in session            | Session must exist on client side                                 |
| GET    | /api/user/:id                      | Get all posts and comments of a specific user | id of user the information is requested for must be in url params |
| GET    | /api/user/post/like                | Get all post likes the user has made          |
| GET    | /api/user/comment/like             | Get all comment likes the user has made       |
| PUT    | /api/user/displayname              | Update users display name                     | userID, displayName must be in request body                       |
| PUT    | /api/user/track                    | Update users track                            | track, token must be in request body                              |
| PUT    | /api/user/githubusername           | Update users github username                  | userID, username must be in request body                          |
| PUT    | /api/user/onboard                  | Sets a users onboarded field to true          |
| DELETE | /api/user/settings/remove-user/:id | Deletes a user                                |

## Post Operations

API hosted at: https://lan-team-a-be.herokuapp.com/

### Post Endpoints

| Method | Endpoint           | Description                          | Requirements                                        |
| ------ | ------------------ | ------------------------------------ | --------------------------------------------------- |
| POST   | /api/post/create   | Creates a post and ties it to a room | title, description, room_id must be in request body |
| GET    | /api/post/:id      | Get a single specific post           | id of post must be in url params                    |
| POST   | /api/post/recent   | Get posts orded by most recent       |
| POST   | /api/post/popular  | Get posts ordered by popularity      |
| POST   | /api/post/search   | Search for posts with search string  | search must be in request body                      |
| GET    | /api/post/like/:id | Like a post                          | id of post must be in url params                    |
| DELETE | /api/post/like/:id | Unlike a post                        | id of post must be in url params                    |

## Comment Operations

API hosted at: https://lan-team-a-be.herokuapp.com/

### Comment Endpoints

| Method | Endpoint                 | Description                             | Requirements                                           |
| ------ | ------------------------ | --------------------------------------- | ------------------------------------------------------ |
| POST   | /api/comment/            | Creates a comment and ties it to a post | postID, comment must be in request body                |
| GET    | /api/comment/recent/:id  | Fetch a post's comments by recent       | id of post fetching comments for must be in url params |
| GET    | /api/comment/popular/:id | Fetch a post's comments by popular      | id of post fetching comments for must be in url params |
| GET    | /api/comment/like/:id    | Like a comment                          | id of comment to like in params of url                 |
| DELETE | /api/comment/like/:id    | Delete a comment like                   | if of comment to remove like in params of url          |

## Assigning Moderator To Room Operations

API hosted at: https://lan-team-a-be.herokuapp.com/

### Room To Moderator Endpoints

| Method | Endpoint              | Description                                                          | Requirements                                        |
| ------ | --------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| POST   | /api/moderator        | Ties a user to a room as a moderator                                 | a user display name and a room name in request body |
| GET    | /api/moderator/findBy | Get rooms belonging to a moderator or moderators belonging to a room | a user display name or room name in request body    |
| DELETE | /api/moderator        | Removes a user as moderator from a room                              | a user display name and a room name in request body |

## Getting Flagged Posts/Comments Operations

API hosted at: https://lan-team-a-be.herokuapp.com/

### Flagged Post/Comment Endpoints

| Method | Endpoint                  | Description                                     | Requirements                                                                             |
| ------ | ------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| POST   | /api/mod/posts/:id        | Flag a post                                     | A post id in the url, a valid flag reason and optional note from user in request body    |
| POST   | /api/mod/comments/:id     | Flag a comment                                  | A comment id in the url, a valid flag reason and optional note from user in request body |
| GET    | /api/mod/posts/flagged    | Get all flagged posts and associated flags      |
| GET    | /api/mod/comments/flagged | Get all flagged comments and associated flags   |
| GET    | /api/mod/posts/:id        | Get all posts in a room and associated flags    | A room id in the url                                                                     |
| GET    | /api/mod/comments/:id     | Get all comments on a post and associated flags | A post id in the url                                                                     |
| GET    | /api/mod/reasons          | Get all list of all flag reasons                |
