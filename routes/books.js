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
  if (req.body.image_url === '') {
    req.body.image_url =
      'https://i5.walmartimages.com/asr/f752abb3-1b49-4f99-b68a-7c4d77b45b40_1.39d6c524f6033c7c58bd073db1b99786.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF';
  }
  req.body.description = req.body.description.replace(
    new RegExp('\r?\n', 'g'),
    '<br />'
  );
  pool.query(
    `INSERT INTO books(ISBN, title, author, publisher, image_url, description, genre) VALUES('${
      req.body.ISBN
    }', '${req.body.title}', '${req.body.author_name}', '${
      req.body.publisher_name
    }', '${req.body.image_url}', $$${req.body.description}$$, ${
      req.body.genre
    })`,
    err => {
      if (err) {
        console.log(err.stack);
      } else {
        pool.query(
          `SELECT id FROM books WHERE ISBN = ${req.body.ISBN}`,
          (err, response) => {
            if (err) {
              console.log(err.stack);
            } else {
              pool.query(
                `INSERT INTO ratings(user_id, book_id, rating) VALUES(0, ${
                  response.rows[0].id
                }, 1)`,
                err => {
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
          `SELECT c.id, c.user_id AS user_id ,c.comment AS comment, u.username AS user FROM comments c, books b, users u WHERE u.id = c.user_id AND c.book_id = b.id AND b.id = ${
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
          pool.query(`DELETE FROM comments WHERE book_id = ${id}`, err => {
            if (err) {
              console.log(err);
            } else {
              pool.query(`DELETE FROM cart WHERE book_id = ${id}`, err => {
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
        pool.query(
          `DELETE FROM cart WHERE book_id = ${req.params.id} AND user_id = ${
            res.locals.currentUser.id
          }`,
          (err, res_cart) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect(`/books/rate/${req.params.id}`);
            }
          }
        );
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
          } AND user_id != 0) WHERE id = ${req.params.id}`,
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
