const pg = require('pg');

const pool = new pg.Pool ({
  user: 'amiya',
  host: '127.0.0.1',
  database: 'project',
  password: 'maruti3315',
  port: '5432'
});

module.exports = pool;
