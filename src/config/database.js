require('dotenv').config();
const { DB_HOST_DATABASE, DB_NAME, DB_USER, DB_PASSWORD,DB_HOST_DATABASE_PRODUCTION,DB_USER_PRODUCTION,DB_PASSWORD_PRODUCTION,DB_NAME_PRODUCTION,DB_SSL_IS,DB_SSL_PRODUCTION_IS } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST_DATABASE,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: DB_SSL_IS,
        native: true,
        rejectUnauthorized: false,
      },
  },
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST_DATABASE,
    dialect: 'postgres',
  },
  production: {
    username: DB_USER_PRODUCTION,
    password: DB_PASSWORD_PRODUCTION,
    database: DB_NAME_PRODUCTION,
    host: DB_HOST_DATABASE_PRODUCTION,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: DB_SSL_PRODUCTION_IS,
        native: true,
        rejectUnauthorized: false,
      }
  }
  }
};
