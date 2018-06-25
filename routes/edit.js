//############################################################
//##########################  SETUP  #########################
//############################################################
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");

const router = express.Router();

const bcrypt = require("bcrypt");

const bcryptSalt = 10;



//############################################################
//##########################  EDIT  ##########################
//############################################################
//render the edit view when accessing the /edit route 
router.get("/edit", (req, res, next) => {
  res.render("edit", {
    errorMessage: ""
  });
})


//runs when user submits the form
router.post("/edit", (req, res, next) => {

 //save the ID to update it's user  
 const userId = req.session.currentUser._id;
 //save inputs from form to update
 const password = req.body.password;
 const email = req.body.email;
 const firstNeighm = req.body.firstNeighm;
 const lastNeighm = req.body.lastNeighm;
 const address = req.body.address;
 //encrypt password
 const salt = bcrypt.genSaltSync(bcryptSalt);
 const hashedPass = bcrypt.hashSync(password, salt);
 

 //object to update
 const userInfo = {
    firstNeighm: firstNeighm,
    lastNeighm:  lastNeighm,
    email:       email,
    address:     address,
    password:    hashedPass,
  };

  
  //when fields are empty, display error
  if(email === "" || address === "" || password === "" || firstNeighm === "" || lastNeighm === ""){
    res.render("edit", {
      errorMessage: "Please enter a field to change",
    })
    return;
  }
  
    //if user doesnt exist, display error
    if(userId === null){
      res.render("edit", {
        errorMessage: `There is no User with the E-Mail: "${email}". Please Sign Up.`
      })
      return;
    }
    
    
  
      //find user by id and update
      User.findByIdAndUpdate(userId, userInfo, { new: true }, (err, theUser) => {
        if (err) {
          next(err);
          return;
        }
    
        req.session.currentUser = theUser;
    
        res.redirect('/');

   });
 })




module.exports = router;