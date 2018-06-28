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

  if (!req.session.currentUser) {
    res.redirect("/login");
    return;
  }

  let userRadius = req.session.currentUser.location.coordinates;
  let userRadLng = userRadius[0];
  let userRadLat = userRadius[1];
  //console.log("debug current userRad", userRadLng, userRadLat);
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
            $maxDistance: 1000 // = 1km
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
                //users.push(user);
                pposts.push(post);
                //aver = true;
              }
            });
          });
          //console.log("Debug uusers", users);
          //console.log("Debug pposts", pposts);

          console.log("debug post multiple", pposts);
          res.render("index", {
            pposts,
            postsStringify: JSON.stringify(pposts),
            usersStringify: JSON.stringify(users),
            userRadLng,
            userRadLat
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
