const express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  methodOverride = require('method-override'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  pool = require('./database/database'),
  bcrypt = require('bcryptjs'),
  session = require('express-session');

// Configuring Method_Override)
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuring Passport
app.use(session({ secret: 'Amiya', resave: true, saveUninitialized: true })); // Session Secret
passport.use(
  new LocalStrategy((username, password, cb) => {
    pool.query(
      `SELECT id, username, password, isAdmin FROM users WHERE username = '${username}'`,
      (err, response) => {
        if (err) {
          console.log(err);
          return cb(err);
        } else {
          if (response.rows.length > 0) {
            const first = response.rows[0];
            bcrypt.compare(password, first.password, (err, res) => {
              if (res) {
                cb(null, {
                  id: first.id,
                  username: first.username,
                  isAdmin: first.isAdmin
                });
              } else {
                cb(null, false);
              }
            });
          } else {
            cb(null, false);
          }
        }
      }
    );
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, cb) => {
  pool.query(
    `SELECT id, username, isAdmin FROM users WHERE id = ${parseInt(id, 10)}`,
    (err, response) => {
      if (err) {
        console.log(err);
        return cb(err);
      } else {
        return cb(null, response.rows[0]);
      }
    }
  );
});

app.use(passport.initialize());
app.use(passport.session()); // Persistant login sessions
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Require Routes
const indexRoute = require('./routes/indexRoutes'),
  bookRoute = require('./routes/books'),
  commentRoute = require('./routes/comment');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use(indexRoute);
app.use('/books', bookRoute);
app.use('/comments', commentRoute);

// Error Page Route
app.get('*', (req, res) => {
  res.render('error');
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, () => {
  console.log(`Listening on port ${server_port}`);
});
