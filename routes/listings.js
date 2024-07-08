const express = require("express");
const router = express.Router();


const asyncWrap = require("../utils/wrapAsync.js"); // fn me fn & return fn
const {listingSchema, reviewSchema} = require("../schema.js"); //Joi
const ExpressError = require("../utils/expressError.js"); // Custom Error Class
const Listing = require("../models/listing.js"); //Listing Schema
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js"); //For Implementing MVC 

const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage }); //Path where photo will be saved..


//Routes for common router i.e Router.route
router.route("/")
.get(
    asyncWrap( 
    listingController.index
))
.post(
    isLoggedIn, 
    upload.single("listing[image]"), 
    validateListing,
    asyncWrap( 
    listingController.createListing
)); //We have clubbed both paths that were starting from "/"
// .post(upload.single("listing[image]"), (req, res)=> {
//     res.send(req.file);
// })


//Create New Route - Make it above listings/:id path otherwise it wont work...
router.get("/new", isLoggedIn, listingController.renderNewForm);


// For show update and delete...
router.route("/:id")
.get(asyncWrap( listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, asyncWrap( listingController.updateListing))
.delete(isLoggedIn, isOwner, asyncWrap( listingController.deleteListing));



// asyncWrap(listingController.renderNewForm)

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap( listingController.renderEditForm));



module.exports = router;