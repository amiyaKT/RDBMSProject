const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// view all cart content

router.get("views", middleware.isAuthenticated, (req,res)=>{
  pool.query(`SELECT c.id AS id, b.title AS title, c.qty AS qty FROM books b, cart c WHERE c.user_id = ${res.locals.currentUser.id} AND b.id = c.book_id`, (err, res_cart)=>{
    if(err){
      console.log(err);
    } else {
      res.render("cart",{cart: res_cart.rows});
    }
  });
});

// manual remove from cart

router.post("/:id/del",middleware.isAuthenticated ,(req,res)=>{
  pool.query(`DELETE FROM cart WHERE id = ${req.params.id}`, (err, res_cart)=>{
    if(err){
      console.log(err);
    } else {
      res.redirect("/cart/views");
    }
  });
});

module.exports = router;
