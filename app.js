const express = require('express'),
      bodyParser = require('body-parser'),
      pg = require('pg'),
      app = express();

// ROUTES
const indexRoute = require('./routes/indexRoutes'),
      bookRoute = require('./routes/books');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

const pool = new pg.Pool ({
  user: 'amiya',
  host: '127.0.0.1',
  database: 'bookdb',
  password: 'maruti3315',
  port: '5432'
});

// ROUTES
app.use(indexRoute);
app.use('/books', bookRoute);

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, () => {
    console.log(`Listening on port ${server_port}`);
});
