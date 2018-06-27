//Setup
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");

const router = express.Router();

//render the profile view when accessing the /profile route
router.get("/profile", (req, res, next) => {
  //if theres no user logged in, redirect to homepage
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }
  res.render("profile");
});

module.exports = router;
