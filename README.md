# Getting started

## Setup
1. Make sure you got the right dependencies, see `package.json`
2. Install dependencies with `yarn install`
3. Run local development with `yarn run dev`
4. Run for production with `yarn start`


## Database

### Creating table
1. Run: `knex migrate:make tablename`, like: `knex migrate:make users`
2. See `/migrations` for example files
3. After setting the schema, run: `knex migrate:latest`
