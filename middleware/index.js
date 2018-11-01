const pool = require('../database/database');

const middlewareObject = {};

middlewareObject.checkIsAdmin = (req, res, next) => {
  if (res.locals.currentUser) {
    const isAdmin = res.locals.currentUser.isadmin;
    if (isAdmin) {
      return next();
    } else {
      res.redirect('back');
    }
  } else {
    res.redirect('/login');
  }
};

middlewareObject.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

middlewareObject.checkCommentOwnership = (req, res, next) => {
  const comment_id = req.params.id;
  pool.query(
    `SELECT user_id FROM comments WHERE id = ${comment_id}`,
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        const commented_user = response.rows[0].user_id;
        const requesting_user = res.locals.currentUser.id;
        if (commented_user === requesting_user) {
          next();
        } else if (res.locals.currentUser.isadmin) {
          if (req.route.stack[0].method === 'put') {
            const adminNote =
              '<strong>CHANGES HAVE BEEN MADE BY ADMIN TO ENSURE THAT THE COMMENTS ARE VALUABLE TO USERS WHO READ.</strong><br />';
            req.body.comment = adminNote + req.body.comment;
            next();
          } else if (req.route.stack[0].method === 'delete') {
            next();
          }
        } else {
          res.redirect('/books');
        }
      }
    }
  );
};

middlewareObject.checkCartOwner = (req, res, next) => {
  const cart_id = req.params.id;
  pool.query(`SELECT user_id FROM cart WHERE id = ${cart_id}`, (err, response) => {
    if(err){
      console.log(err);
    } else {
      const cart_owner = response.rows[0].user_id;
      const requesting_user = res.locals.currentUser.id;
      if(cart_user || requesting_user) next();
      else if(req.route.stack[0].method === 'delete') next();
      else {
        console.log("You are not the owner!!");
        res.redirect('/cart');
      }
    }
  });
};

module.exports = middlewareObject;
