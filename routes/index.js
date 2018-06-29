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
    //.populate("_comments") MAYBE YOU NEED IT
    .populate({
      path: "_comments",
      model: "Comment",
      populate: {
        path: "_owner",
        model: "User"
      },
      // populate: {
      //   path: "createdAt",
      //   model: "Comment"
      // },
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
            if(post._comments.length > 0){
              console.log("precise id post", post._comments);
            } else {
              console.log('yolo')
            }
            users.forEach(user => {
              //console.log("precise id USER", user._id.toString());
              //console.log("typeof", typeof user._id.toString());
              if (user._id.toString() == post._owner._id.toString()) {
                // console.log("yey true");
                //users.push(user);
                // console.log(post.createdAt.toLocaleTimeString());
                //dates.push(post.createdAt.toLocaleDateString());
                // hours.push(post.createdAt.toLocaleTimeString());

                post.date = post.createdAt.toLocaleDateString();
                post.hour = post.createdAt.toLocaleTimeString();
                //post._comments;
                pposts.push(post);
              }
            });
          });

          //console.log("debug post multiple", pposts);
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
