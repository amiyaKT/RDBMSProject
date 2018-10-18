const pg = require('pg');

const pool = new pg.Pool({
  user: 'jedysgnrdmbeml',
  host: 'ec2-23-21-147-71.compute-1.amazonaws.com',
  database: 'dts9qm174n3m',
  password: 'c6f338dece3076829650f048297e584fb3196e667b772caea9d1fa9b01da7925',
  port: '5432'
});

module.exports = pool;
