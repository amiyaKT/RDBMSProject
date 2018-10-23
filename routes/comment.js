const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// ADD A NEW COMMENT

router.post("/books/:id/comments/new", middleware.isAuthenticated, (req,res)=>{
  pool.query(`INSERT INTO comments  VALUES(${res.locals.currentUser.id}, '${req.body.comm}', ${req.params.id}
)`,(err, response) => {
    if(err){
      console.log(err);
    } else {
      res.redirect(`books/${req.params.id}`);
    }
  });
});

// UPDATE COMMENTS



// DELETE COMMENTS

module.exports = router;
