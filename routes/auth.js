//############################################################
//##########################  SETUP  #########################
//############################################################
const express = require("express");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const User = require("../models/user");

const router = express.Router();

const bcryptSalt = 10;

//############################################################
//##########################  SIGN UP  #######################
//############################################################
//render the signup view when accessing the /signup route
router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {
    errorMessage: ""
  });
});

//runs when user submits the form
router.post("/signup", (req, res, next) => {
  //save the inputs from the form in variables

  let email = req.body.email;
  let address = req.body.address;
  let password = req.body.password;

  //when fields are empty, display error
  if (email === "" || address === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please fill in every field"
    });
    return;
  }

  //find user by their input email
  User.findOne({ email: email }, "_id", (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    //if user exists, display error
    if (existingUser !== null) {
      res.render("auth/signup", {
        errorMessage: `The email "${email}" is already in use.`
      });
      return;
    }

    //encrypt password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    let location = {
      type: "Point",
      coordinates: [req.body.longitude, req.body.latitude]
    };

    //save input values in user object to save later
    const userSubmission = {
      email: email,
      address: address,
      password: hashedPass,
      location: location
    };

    //create new instance
    const theUser = new User(userSubmission);
    //save the instance in database
    theUser.save(err => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong. Try again later."
        });
        return;
      }

      res.redirect("/");
    });
  });
});

//############################################################
//##########################  LOGIN  #########################
//############################################################
//render the login view when accessing the /login route
router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    errorMessage: ""
  });
});

//runs when user logs in with the form
router.post("/login", (req, res, next) => {
  //save inputs in variables
  const email = req.body.email;
  const password = req.body.password;

  //if fields are empty, display error
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Enter both email and password to log in."
    });
    return;
  }

  //find user in database through email
  User.findOne({ email: email }, (err, theUser) => {
    //if user doesn't exist, display error
    if (err || theUser === null) {
      res.render("auth/login", {
        errorMessage: `There isn't an account with email ${email}.`
      });
      return;
    }

    //compare the input password with the password saved in the database
    if (!bcrypt.compareSync(password, theUser.password)) {
      res.render("auth/login", {
        errorMessage: "Invalid password."
      });
      return;
    }

    //if everything went right, create a session
    req.session.currentUser = theUser;
    res.redirect("/");
  });
});

//############################################################
//##########################  LOGOUT  ########################
//############################################################
router.get("/logout", (req, res, next) => {
  //if theres no user logged in, redirect to homepage
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }

  //destroy the session
  req.session.destroy(err => {
    if (err) {
      next(err);
      return;
    }
    //redirect to homepage
    res.redirect("/");
  });
});

module.exports = router;
