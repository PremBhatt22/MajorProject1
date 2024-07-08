const express = require("express");
const router = express.Router({mergeParams : true});

const reviewController = require("../controllers/reviews.js");

const {listingSchema, reviewSchema} = require("../schema.js");
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js"); 
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor, validateReview} = require("../middleware.js");

//Reviews
//Submit Review path
router.post("/",validateReview, isLoggedIn, asyncWrap(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrap(reviewController.deleteReview));

module.exports = router;
