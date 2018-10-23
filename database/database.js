const pg = require('pg');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Use the below Connection String for developement purposees and the above in heroku environment
  // connectionString:
  // 'postgres://jedysgnrdmbeml:c6f338dece3076829650f048297e584fb3196e667b772caea9d1fa9b01da7925@ec2-23-21-147-71.compute-1.amazonaws.com:5432/dts9qm174n3m',
  ssl: true
});

module.exports = pool;
