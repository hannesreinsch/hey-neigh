//Setup
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");

const router = express.Router();

//render the profile view when accessing the /profile route
router.get("/profile/:id", (req, res, next) => {
  //if theres no user logged in, redirect to homepage
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }

  let userId = req.params.id;
  
  console.log(userId);
  User.findOne({'_id': userId})
    .then(user => {
      res.render("profile", { user })
    })
    .catch(error => {
      console.log(error)
    })
  })

module.exports = router;
