# Getting started

## Development

### Create your .env file
Create your `.env` file in the project root, containing:
```
NODE_ENV=development

DATABASE_URL=postgres://coinaly:coinaly@postgres:5432/coinaly
REDIS_URL=redis://redis:6379

ENCODE_SECRET=your-super-secret

POSTGRES_PASSWORD=coinaly
POSTGRES_USER=coinaly
POSTGRES_DB=coinaly
```

### Run the project locally
1. Make sure you have set up Docker correctly
2. Run: `docker-compose up`. When that's done, Docker runs in the background.
3. Open the Postgres database in a client
4. Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
5. Restart
6. Run migrations: `npm run dev:migrate`
4. Project is available at: http://localhost:5000

Redis will run at port `6379`. Postgres wil run at port `5432`.

## Using Docker
The `Dockerfile` is used for production.
The `docker-compose.yml` is used for local development. It leverages `Dockerfile`, but uses different environment variables and a different run command to start.

1. Run `docker-compose up --build -d` to build the container locally and then run it.
2. After a succesful run port 5000 is exposed.

### Changed Dockerfile or docker-compose file?
1. Make a new image build: `docker-compose build`


## Setup
1. Make sure you got the right dependencies, see `package.json`
2. Install dependencies with `yarn install`
3. Run local development with `yarn run dev`
4. Run for production with `yarn start`


## Database

### Creating table
1. Run: `knex migrate:make tablename`, like: `knex migrate:make users`
2. See `/database/migrations` for example files
3. After setting the schema, run: `knex migrate:latest`

### Creating seed
1. Run `knex seed:make seedname`, like: `knex seed:make users`
2. See `/database/seeds` for example files
3. After setting up the seed, run `knex seed:run`
