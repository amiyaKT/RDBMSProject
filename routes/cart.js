const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// view all cart content

router.get('/', middleware.isAuthenticated, (req, res) => {
  if(!res.locals.currentUser.id){
    res.redirect('/login');
  } else {
    pool.query(
      `SELECT c.id AS id, c.book_id ,b.title AS title, c.qty AS qty FROM books b, cart c WHERE c.user_id = ${
        res.locals.currentUser.id
      } AND b.id = c.book_id`,
      (err, res_cart) => {
        if (err) {
          console.log(err);
        } else {
          res.render('cart', { cart: res_cart.rows });
        }
      }
    );
  }
});

// Add TO Cart

router.post('/:id/add', middleware.isAuthenticated, (req, res) => {
  pool.query(
    `INSERT INTO cart (user_id, book_id) VALUES(${res.locals.currentUser.id}, ${
      req.params.id
    })`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/books/${req.params.id}`);
      }
    }
  );
});

// manual remove from cart

router.delete('/:id', [middleware.isAuthenticated, middleware.checkCartOwner], (req, res) => {
  pool.query(
    `DELETE FROM cart WHERE id = ${req.params.id}`,
    (err, res_cart) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/cart/${res.locals.currentUser.id}/views`);
      }
    }
  );
});

module.exports = router;
