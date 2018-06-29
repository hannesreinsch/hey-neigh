//Setup
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");

const router = express.Router();

//render the profile view when accessing the /profile route
router.get("/profile/:id", (req, res, next) => {
  let pposts = [];
  //if theres no user logged in, redirect to homepage
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }
  let userId = req.params.id;
  // console.log("userId", userId);
  User.findOne({ _id: userId })
    .then(user => {
      Post.find({ _owner: userId })
        .populate("_owner")
        .populate({
          path: "_comments",
          model: "Comment",
          populate: {
            path: "_owner",
            model: "User"
          }
        })
        .then(posts => {
          //console.log("searching for my posts", posts._comments);
          posts.forEach(post => {
            post.date = post.createdAt.toLocaleDateString();
            post.hour = post.createdAt.toLocaleTimeString();
            pposts.push(post);
          });

          res.render("profile", { pposts, user });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
