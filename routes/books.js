const express = require('express'),
      pool = require('../database/database'),
      router = express.Router();

// BOOKS ROUTES

router.get('/', (req, res) => {
  pool.query(`SELECT b.id, b.ISBN, b.title, b.title, b.author, b.publisher, b.image_url, b.description, b.rating, g.name FROM books b, genre g WHERE g.id = b.genre`, (err, response) => {
    if(err) {
      console.log(err);
    } else {
      res.render('./books/index', {books: response.rows});
    }
  });
});

router.get('/new', (req, res) => {
  pool.query(`SELECT * FROM genre`, (err, response) => {
    if(err) {
      console.log(err);
    } else {
      res.render('./books/new', {genres: response.rows});
    }
  });
});

router.post('/', (req, res) => {
  pool.query(`INSERT INTO books(ISBN, title, author, publisher, image_url, description, genre) VALUES('${req.body.book.ISBN}', '${req.body.book.title}', '${req.body.book.author_name}', '${req.body.book.publisher_name}', '${req.body.book.image_url}', '${req.body.book.description}', ${req.body.book.genre})`, (err, response) => {
    if (err) {
      console.log(err.stack);
    }else{
      res.redirect('/books');
    }
  });
  // res.send(req.body.book);
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
