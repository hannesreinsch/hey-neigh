const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

/* GET home page */
router.get("/", (req, res, next) => {
  //Comment.find({});
  Post.find({})
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
      res.render("index", { posts });
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
