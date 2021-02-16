## Lambda Alumni Network (LAN)

### Contributors
Team A Members

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
