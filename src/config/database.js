require('dotenv').config();
const { DB_HOST_DATABASE, DB_NAME, DB_USER, DB_PASSWORD,DB_HOST_DATABASE_PRODUCTION,DB_USER_PRODUCTION,DB_PASSWORD_PRODUCTION,DB_NAME_PRODUCTION,DB_SSL_IS,DB_SSL_PRODUCTION_IS } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST_DATABASE,
    dialect: 'postgres',
    native: true,
    dialectOptions: {
      ssl: {
        require: DB_SSL_IS,
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
    url: 'postgres://DB_USER_PRODUCTION:DB_PASSWORD_PRODUCTION@DB_HOST_DATABASE_PRODUCTION:5432/DB_NAME_PRODUCTION?sslmode=require',
    dialect: 'postgres',
    native: true,
    dialectOptions: {
      ssl: {
        require: DB_SSL_PRODUCTION_IS,
        rejectUnauthorized: false,
      }
    }
  }
  
};
