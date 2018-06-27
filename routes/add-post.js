//############################################################
//##########################  SETUP  #########################
//############################################################
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");

const Post = require("../models/post");

const router = express.Router();

//############################################################
//##########################  POST  ##########################
//############################################################
//render the signup view when accessing the /signup route
router.get("/add-post", (req, res, next) => {
  //if user is not logged in, redirect to homepage
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }
  res.render("index", {
    errorMessage: ""
  });
});

//adds post to database
router.post("/add-post", (req, res, next) => {
  //save the inputs from the form in variables
  let text = req.body.text;
  let owner = req.session.currentUser._id;
  let comments = [];

  //when field is empty, display error
  if (text === "") {
    res.render("index", {
      errorMessage: "Please write something to post"
    });
    return;
  }

  //save input values in post object to save later
  const postSubmission = {
    text: text,
    _owner: owner,
    _comments: comments
  };

  //create new instance
  const thePost = new Post(postSubmission);
  //save the instance in database
  thePost.save(err => {
    if (err) {
      console.log(err);
      res.render("index", {
        errorMessage: "Something went wrong. Try again later."
      });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
