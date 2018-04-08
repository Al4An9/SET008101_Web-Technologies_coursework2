var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

// Post Model
var Post = require('../models/posts');
// User Model
var User = require('../models/user');

router.get('/add', ensureAuthenticated, function(req, res){
	res.render('newposts');
});

// Add post to DB (POST route)
router.post('/add', function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('url', 'Url is required').notEmpty();
    req.checkBody('summary', 'Summary is required').notEmpty();

    //Get Errors
    var errors = req.validationErrors();

    if (errors){
        res.render('newposts', {
            errors: errors
        });

    } else {
        var newPost = new Post(req.body);
        newPost.title = req.body.title;
        newPost.url = req.body.url;
        newPost.summary = req.body.summary;
        newPost.author = req.user._id;

        newPost.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                console.log('Your post has been saved.');
                req.flash('success_msg', 'Your post has been suceesfully created');
                res.redirect('/');
            }
        });
    }
});


// Load Edit form for single post from DB
router.get('/posts/edit/:id', ensureAuthenticated, function(req, res){
   Post.findById(req.params.id, function(err, post){
    if(post.author !=req.user._id){
        req.flash('error_msg', 'Not Authorised');
        return res.redirect('/');
    }
        res.render('edit_singlepost', {
            post: post
        });
    }); 
});


// Update submit post to DB  (POST Route)
router.post('/posts/edit/:id', function(req, res){
    var editPost = {};
    editPost.title = req.body.title;
    editPost.url = req.body.url;
    editPost.summary = req.body.summary;
    //editPost.author = req.body.author;

    var query = {_id:req.params.id};
    Post.update(query, editPost, function(err){
        if(err){
            console.log(err);
            return;
        } else {
        console.log('Your post has been successfully updated.');
        req.flash('success_msg', 'Your post has been suceesfully updated.');
        res.redirect('/');
        }
    });
});

// Delete post from Db
router.get('/posts/delete/:id', function (req, res) {
  var query = {_id: req.params.id};

  Post.findById(req.params.id, function(err, post){
    if(post.author !=req.user._id){
        req.flash('error_msg', 'Not Authorised');
        return res.redirect('/');
    }
        Post.remove(query, function (err) {
        if(err){
            console.log(err);
            return;
        } else {
            console.log('Your post has been successfully deleted.');
            req.flash('success_msg', 'Your post has been successfully deleted.');
            res.redirect('/');
        }
        });
    
  });
});﻿

// Get single post from DB
router.get('/posts/:id', ensureAuthenticated, function(req, res){
   Post.findById(req.params.id, function(err, post){
    User.findById(post.author, function(err, user){
        res.render('singlepost', {
            post: post,
            author: user.name
            });
        });
    }); 
});



// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;