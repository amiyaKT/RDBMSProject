const express = require('express'),
      router = express.Router();

// BOOKS ROUTES

router.get('/', (req, res) => {
  res.render('books/index');
});

router.get('/new', (req, res) => {
  res.render('books/new');
});

router.post('/', (req, res) => {
  res.send('ADD Book Logic');
});

router.get('/:id', (req, res) => {
  res.render('books/show');
});

router.get('/:id/edit', (req, res) => {
  res.render('books/edit');
});

router.put('/:id', (req, res) => {
  res.send('UPDATE Book Details Logic');
});

router.delete('/:id', (req, res) => {
  res.send('DELETE Book Details Logic');
});

module.exports = router;
