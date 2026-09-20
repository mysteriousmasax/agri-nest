require('dotenv').config();
module.exports = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST || '127.0.0.1',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'agri',
    password: process.env.PG_PASSWORD || 'agri',
    database: process.env.PG_DATABASE || 'agri'
  },
  pool: { min: 0, max: 10 }
};
