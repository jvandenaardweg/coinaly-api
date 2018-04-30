require('dotenv').config({ path: '../.env' })

module.exports = {

  development: {
    client: 'postgresql',
    debug: true,
    ssl: false,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 15
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  staging: {
    client: 'postgresql',
    debug: true,
    ssl: true,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 15
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  test: {
    client: 'postgresql',
    debug: false,
    ssl: false,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 15
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  production: {
    client: 'postgresql',
    debug: false,
    ssl: true,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 15
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  }

};
