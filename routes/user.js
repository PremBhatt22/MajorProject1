const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const asyncWrap = require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedIn, saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

//SignUp user
//Loads the form
//Post request to actually sign in the user.
router.route("/signup")
.get(userController.renderSignup) //Loads the form 
.post(asyncWrap(userController.signup)); //Signs in user



//Login Route - Loads login form
//Actually logs in the user
router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
        passport.authenticate("local", {
        failureRedirect : "/login",
        failureFlash : true
}), 
userController.login);



//Logout Path
router.get("/logout", isLoggedIn, userController.logout);

module.exports = router; 