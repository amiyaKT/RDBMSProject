const express = require('express'),
  pool = require('../database/database.js'),
  router = express.Router(),
  bcrypt = require('bcryptjs'),
  passport = require('passport');

const saltRounds = 10;

router.get('/', (req, res) => {
  // res.send(res.locals.currentUser);
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const plainPassword = req.body.password;
  const cuser = req.body;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(plainPassword, salt, (err, hash) => {
      pool.query(
        `INSERT INTO users(firstname, lastname, password, email, address, username) VALUES('${
          cuser.firstname
        }', '${cuser.lastname}', '${hash}', '${cuser.email}', '${
          cuser.address
        }', '${cuser.username}')`,
        (err, response) => {
          if (err) {
            console.log(err);
            res.redirect('/register');
          } else {
            passport.authenticate('local')(req, res, () => {
              res.redirect('/books');
            });
          }
        }
      );
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/login'
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('back');
});

module.exports = router;
