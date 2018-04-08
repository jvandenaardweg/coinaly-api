# Getting started

## Development
1. Pull this repo
2. Make sure you have set up Docker correctly
3. Run: `npm run docker:dev`. When that's done, Docker runs in the background.
4. Project is available at: http://localhost:5000

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
