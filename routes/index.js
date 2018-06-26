const express = require("express");
const router = express.Router();
const Post = require("../models/post");

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find({})
    .populate("_owner")
    .then(posts => {
      res.render("index", { posts });
      console.log(posts);
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
