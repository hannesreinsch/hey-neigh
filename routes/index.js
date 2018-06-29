const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

/* GET home page */
router.get("/", (req, res, next) => {
  //Comment.find({});
  //let dates = [];
  let pposts = [];
  //let hours = [];
  let comments = [];

  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }

  let userRadius = req.session.currentUser.location.coordinates;
  let userRadLng = userRadius[0];
  let userRadLat = userRadius[1];

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
      User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userRadius[0], userRadius[1]]
            },
            $minDistance: 0,
            $maxDistance: 1000 // = 1.5km
          }
        }
      })
        .then(users => {
          posts.forEach(post => {
            users.forEach(user => {
              if (user._id.toString() == post._owner._id.toString()) {
                post.date = post.createdAt.toLocaleDateString();
                post.hour = post.createdAt.toLocaleTimeString();

                post._comments.forEach(comment => {
                  comment.date = comment.createdAt.toLocaleDateString();
                  comment.hour = comment.createdAt.toLocaleTimeString();

                  comments.push(comment);
                });
                pposts.push(post);
                //console.log(comments);
              }
            });
          });

          //console.log("debug post multiple", pposts);
          res.render("index", {
            pposts,
            postsStringify: JSON.stringify(pposts),
            usersStringify: JSON.stringify(users),
            userRadLng,
            userRadLat,
            comments
          });
        })
        .catch(err => {
          throw err;
        })

        .catch(err => {
          throw err;
        });
    });
});

module.exports = router;
