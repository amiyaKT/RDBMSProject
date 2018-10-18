const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// BOOKS ROUTES

router.get('/', (req, res) => {
  pool.query(
    `SELECT b.id, b.ISBN, b.title, b.title, b.author, b.publisher, b.image_url, b.rating, g.name FROM books b, genre g WHERE g.id = b.genre`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.render('./books/index', { books: response.rows });
      }
    }
  );
});

router.get('/new', middleware.checkIsAdmin, (req, res) => {
  pool.query(`SELECT * FROM genre`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response.rows);
      res.render('./books/new', { genres: response.rows });
    }
  });
});

router.post('/', middleware.checkIsAdmin, (req, res) => {
  if (req.body.book.image_url === '') {
    req.body.book.image_url =
      'https://i5.walmartimages.com/asr/f752abb3-1b49-4f99-b68a-7c4d77b45b40_1.39d6c524f6033c7c58bd073db1b99786.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF';
  }
  pool.query(
    `INSERT INTO books(ISBN, title, author, publisher, image_url, description, genre) VALUES('${
      req.body.book.ISBN
    }', '${req.body.book.title}', '${req.body.book.author_name}', '${
      req.body.book.publisher_name
    }', '${req.body.book.image_url}', '${req.body.book.description}', ${
      req.body.book.genre
    })`,
    (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        res.redirect('/books');
      }
    }
  );
});

router.get('/:id', (req, res) => {
  pool.query(
    `SELECT b.id, b.ISBN, b.title, b.title, b.author, b.publisher, b.image_url, b.description, b.rating, g.name AS genre FROM books b, genre g WHERE g.id = b.genre AND b.id = ${
      req.params.id
    }`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        // res.send(response.rows[0]);
        res.render('./books/show', { book: response.rows[0] });
      }
    }
  );
});

router.get('/edit/:id', middleware.checkIsAdmin, (req, res) => {
  pool.query(`SELECT * FROM genre`, (err, response_genre) => {
    if (err) {
      console.log(err);
    } else {
      pool.query(
        `SELECT b.id, b.ISBN, b.title, b.title, b.author, b.publisher, b.image_url, b.description, b.rating, g.name AS genre FROM books b, genre g WHERE g.id = b.genre AND b.id = ${
          req.params.id
        }`,
        (err, response) => {
          if (err) {
            console.log(err);
          } else {
            res.render('./books/edit', {
              genres: response_genre.rows,
              book: response.rows[0]
            });
          }
        }
      );
    }
  });
});

router.put('/:id', middleware.checkIsAdmin, (req, res) => {
  res.send('UPDATE Book Details Logic');
});

router.delete('/:id', middleware.checkIsAdmin, (req, res) => {
  let id = req.params.id;
  pool.query(`DELETE FROM books WHERE id = ${id}`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/books');
    }
  });
});

module.exports = router;
