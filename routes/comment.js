const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// ADD A NEW COMMENT

router.post('/:id', middleware.isAuthenticated, (req, res) => {
  req.body.comment = req.body.comment.replace(
    new RegExp('\r?\n', 'g'),
    '<br />'
  );

  pool.query(
    `INSERT INTO comments(user_id, comment, book_id) VALUES(${
      res.locals.currentUser.id
    },$$${req.body.comment}$$, ${req.params.id}
  )`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/books/${req.params.id}`);
      }
    }
  );
});

// UPDATE COMMENT

router.post("/:id/edit/:book", middleware.isAuthenticated, (req, res) => {
  req.body.comm_edited = req.body.comm_edited.replace(
    new RegExp('\r?\n', 'g'),
    '<br />'
  );
  pool.query(`UPDATE comments SET comment = $$${req.body.comment}$$ WHERE id = ${req.params.id}` , (err, response)=>{
    if(err){
      console.log(err);
    } else {
      res.redirect(`/books/${req.params.book}`);
    }
  });
});

// DELETE COMMENT

router.post("/:id/del/:book", middleware.isAuthenticated, (req, res) => {
  pool.query(`DELETE FROM comments WHERE id = ${req.params.id}` , (err, response)=>{
    if(err){
      console.log(err);
    } else {
      res.redirect(`/books/${req.params.book}`);
    }
  });
});


module.exports = router;
