//############################################################
//##########################  SETUP  #########################
//############################################################
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");

const Post = require("../models/post");

const Comment = require("../models/comment")

const router = express.Router();




//############################################################
//##########################  Comment  #######################
//############################################################
//render the index view when accessing the /add-comment route 
router.get("/add-comment", (req, res, next) => {
    //if user is not logged in, redirect to homepage
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }

  res.render("index", {
    errorMessage: ""
  });
})


//adds comment to database
router.post("/add-comment", (req, res, next) => {

 //save the inputs from the form in variables
 let postId = req.body.postId;
 let text = req.body.text;
 let owner = req.session.currentUser._id;

 //when field is empty, display error
 if(text === ""){
   res.render("index", {
     errorMessage: "Please write something to comment",
   })
   return;
 }

   //save input values in comment object to save later 
   const commentSubmission = {
     text: text,
     _owner: owner,
   }

   //create new instance
   const theComment = new Comment(commentSubmission);
   //save the instance in database
   theComment.save()
   .then( () => {
    //push comment-id in post-comment-array
     Post.findByIdAndUpdate(postId, { $push: {_comments: theComment} }, {new: true})
      .then( () =>
        res.redirect("/"))
 })
    .catch(err => {
      res.render('index', {
         errorMessage: 'Something went wrong. Try again later.'
      });
 })
})











module.exports = router;