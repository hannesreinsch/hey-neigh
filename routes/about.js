//############################################################
//##########################  SETUP  #########################
//############################################################
const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/user");

const router = express.Router();


//############################################################
//##########################  EDIT  ##########################
//############################################################
//render the edit view when accessing the /edit route 
router.get("/about", (req, res, next) => {
  res.render("about");
})



module.exports = router;