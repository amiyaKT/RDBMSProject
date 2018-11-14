const express = require('express'),
  pool = require('../database/database.js'),
  router = express.Router(),
  bcrypt = require('bcryptjs'),
  passport = require('passport'),
  middleware = require('../middleware/index'),
  { spawn } = require('child_process');

const saltRounds = 10;

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    const pythonProcess = spawn('python', ['./python/script.py']);
    pythonProcess.stdout.on('data', data => {
      const response = JSON.parse(data.toString().replace(/'/g, '"'));
      const recommendedData = [];
      response.forEach(bookId => {
        pool.query(`SELECT * FROM books WHERE id = ${bookId}`, (err, resp) => {
          if (err) {
            console.log(err);
          } else {
            recommendedData.push(resp.rows[0]);
          }
        });
      });
      setTimeout(() => {
        res.send(recommendedData);
      }, 20000);
    });
  } else {
    pool.query(
      `SELECT * FROM books ORDER BY rating LIMIT 5`,
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.send(response.rows);
        }
      }
    );
  }
});

router.get('/register', (req, res) => {
  res.render('register', { errors: null });
});

router.post('/register', (req, res) => {
  const validationErrors = {};
  if (req.body.firstname === '') {
    validationErrors.firstname = true;
  }
  if (req.body.lastname === '') {
    validationErrors.lastname = true;
  }
  if (req.body.username === '') {
    validationErrors.username = true;
  }
  if (req.body.email === '') {
    validationErrors.email = true;
  }
  if (req.body.address === '') {
    validationErrors.address = true;
  }
  if (req.body.password === '') {
    // More password validations
    validationErrors.password = true;
  }

  if (
    validationErrors.firstname ||
    validationErrors.lastname ||
    validationErrors.username ||
    validationErrors.email ||
    validationErrors.address ||
    validationErrors.password
  ) {
    res.render('register', { errors: validationErrors });
  } else {
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
  }
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

router.get('/logout', middleware.isAuthenticated, (req, res) => {
  req.logout();
  res.redirect('back');
});

module.exports = router;
