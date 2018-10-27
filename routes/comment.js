const express = require('express'),
  pool = require('../database/database'),
  router = express.Router({ mergeParams: true }),
  middleware = require('../middleware/index');

// ADD A NEW COMMENT

router.post('/', middleware.isAuthenticated, (req, res) => {
  req.body.comment = req.body.comment.replace(
    new RegExp('\r?\n', 'g'),
    '<br />'
  );

  pool.query(
    `INSERT INTO comments(user_id, comment, book_id) VALUES(${
      res.locals.currentUser.id
    },$$${req.body.comment}$$, ${req.params.book}
  )`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/books/${req.params.book}`);
      }
    }
  );
});

// UPDATE COMMENT

router.put(
  '/:id',
  [middleware.isAuthenticated, middleware.checkCommentOwnership],
  (req, res) => {
    req.body.comment = req.body.comment.replace(
      new RegExp('\r?\n', 'g'),
      '<br />'
    );
    pool.query(
      `UPDATE comments SET comment = $$${req.body.comment}$$ WHERE id = ${
        req.params.id
      }`,
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(`/books/${req.params.book}`);
        }
      }
    );
  }
);

// DELETE COMMENT

router.delete(
  '/:id',
  [middleware.isAuthenticated, middleware.checkCommentOwnership],
  (req, res) => {
    pool.query(
      `DELETE FROM comments WHERE id = ${req.params.id}`,
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(`/books/${req.params.book}`);
        }
      }
    );
  }
);

module.exports = router;
