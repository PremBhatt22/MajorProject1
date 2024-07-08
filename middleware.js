const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js"); //Joi
const ExpressError = require("./utils/expressError.js"); // Custom Error Class

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; //We are storing the URL where we need to redirect the user after logging  in.
        req.flash("error", "You must be logged in for this action");
        return res.redirect("/login");
    }
    next();
} 

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have Permission/Authority.");
        return res.redirect("/listings"+id);
    }
    next();
}  

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(500, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id ,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have Permission/Authority to do this.");
         return res.redirect("/listings/"+id);
    }
    next();
}  