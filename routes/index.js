const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

/* GET home page */
router.get("/", (req, res, next) => {
  //Comment.find({});
  //let uusers = [];
  let pposts = [];
  let aver = false;
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
            $geometry: { type: "Point", coordinates: [13.4529455, 52.4999521] },
            $minDistance: 0,
            $maxDistance: 10000 // = 1km
          }
        }
      })
        .then(users => {
          //console.log("radius users", users); YES WORKS!!!!!
          // console.log("debug users", users);
          posts.forEach(post => {
            // console.log("debug post", post);
            // console.log("precise id post", post._owner._id);
            users.forEach(user => {
              //console.log("precise id USER", user._id.toString());
              //console.log("typeof", typeof user._id.toString());
              if (user._id.toString() == post._owner._id.toString()) {
                // console.log("yey true");
                users.push(user);
                pposts.push(post);
                aver = true;
              } else {
                return;
              }
            });
          });
          console.log("Debug uusers", users);
          console.log("Debug pposts", pposts);
          if (true || aver) { // TODO: remove it?
            res.render("index", {
              pposts,
              postsStringify: JSON.stringify(pposts),
              users,
              usersStringify: JSON.stringify(users)
            });
          }
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
