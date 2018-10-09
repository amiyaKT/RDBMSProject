const express = require('express'),
      pool = require('../database/database.js'),
      router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  res.send('Register Logic');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  res.send("login logic");
});

router.get('/logout', (req, res) => {
  res.send('logoutLogic');
});

module.exports = router;
