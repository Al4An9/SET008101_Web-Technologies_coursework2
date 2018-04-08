var express = require('express');
var router = express.Router();


var Post = require('../models/posts');
// Home Route
router.get('/',ensureAuthenticated, function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    } else {
      res.render('viewposts', {
        title:'Posts',
        posts: posts
      });
    }
  });
});

//
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;