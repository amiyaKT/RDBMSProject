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
    res.redirect('back');
  }
};

middlewareObject.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = middlewareObject;
