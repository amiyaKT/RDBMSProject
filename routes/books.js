const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// BOOKS ROUTES

// Show all Books
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

// Show add new book form for admin
router.get('/new', middleware.checkIsAdmin, (req, res) => {
  pool.query(`SELECT * FROM genre`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.render('./books/new', { genres: response.rows });
    }
  });
});

// Logic to add a new book to the database via the add the new book form
router.post('/', middleware.checkIsAdmin, (req, res) => {
  if (req.body.book.image_url === '') {
    req.body.book.image_url =
      'https://i5.walmartimages.com/asr/f752abb3-1b49-4f99-b68a-7c4d77b45b40_1.39d6c524f6033c7c58bd073db1b99786.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF';
  }
  req.body.book.description = req.body.book.description.replace(
    new RegExp('\r?\n', 'g'),
    '<br />'
  );
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

// Show description and extra details about a particular book
router.get('/:id', (req, res) => {
  pool.query(
    `SELECT b.id, b.ISBN, b.title, b.title, b.author, b.publisher, b.image_url, b.description, b.rating, g.name AS genre FROM books b, genre g WHERE g.id = b.genre AND b.id = ${
      req.params.id
    }`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        pool.query(
          `SELECT c.id ,c.user_id AS user_id ,c.comment AS comment, u.username AS user FROM comments c, books b, users u WHERE u.id = c.user_id AND c.book_id = b.id AND b.id = ${
            req.params.id
          } ORDER BY c.id`,
          (err, res_comments) => {
            // res.send(response.rows[0]);
            res.render('./books/show', {
              book: response.rows[0],
              comments: res_comments.rows
            });
          }
        );
      }
    }
  );
});

// Edit book details form for admin
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

// Logic to update book details
router.put('/:id', middleware.checkIsAdmin, (req, res) => {
  res.send('UPDATE Book Details Logic');
});

// Delete a particular book from database
router.delete('/:id', middleware.checkIsAdmin, (req, res) => {
  let id = req.params.id;
  pool.query(`DELETE FROM history WHERE book_id = ${id}`, err => {
    if (err) {
      console.log(err);
    } else {
      pool.query(`DELETE FROM ratings WHERE book_id = ${id}`, err => {
        if (err) {
          console.log(err);
        } else {
          pool.query(`DELETE FROM books WHERE id = ${id}`, err => {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/books');
            }
          });
        }
      });
    }
  });
});

// Purchase a specific book
router.post('/purchase/:id', middleware.isAuthenticated, (req, res) => {
  pool.query(
    `INSERT INTO history(user_id, book_id) VALUES(${
      res.locals.currentUser.id
    }, ${req.params.id})`,
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect(`/books/rate/${req.params.id}`);
      }
    }
  );
});

// User will rate a book here
router.get('/rate/:id', middleware.isAuthenticated, (req, res) => {
  pool.query(
    `SELECT * FROM ratings WHERE user_id = ${
      res.locals.currentUser.id
    } AND book_id = ${req.params.id}`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        if (response.rows.length > 0) {
          res.redirect('/books');
        } else {
          res.render('./books/rate', { book_id: req.params.id });
        }
      }
    }
  );
});

// User rating logic
router.post('/rate/:id', middleware.isAuthenticated, (req, res) => {
  pool.query(
    `INSERT INTO ratings VALUES(${res.locals.currentUser.id}, ${
      req.params.id
    }, ${req.body.rating})`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        pool.query(
          `UPDATE books SET rating = (SELECT AVG(rating) FROM ratings WHERE book_id = ${
            req.params.id
          }) WHERE id = ${req.params.id}`,
          (err, response) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/books');
            }
          }
        );
      }
    }
  );
});

module.exports = router;
