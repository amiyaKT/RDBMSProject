const express = require('express'),
  pool = require('../database/database'),
  router = express.Router(),
  middleware = require('../middleware/index');

// ADD A NEW COMMENT

router.post("/books/:id/comments/new", middleware.isAuthenticated,(req,res)=>{
  pool.query(`INSERT INTO comments VALUES(${req.locals.currentUser.id}, ${req.body.comm}, ${req.params.id}
  )`,(err, res) => {
    if(err){
      console.log(err);
    } else {
      res.render(`books/${req.params.id}`);
    }
  });
});


module.exports = router;
