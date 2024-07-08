const Review = require("../models/review"); //Review Schema
const Listing = require("../models/listing"); // Listing Schema


module.exports.createReview = async (req, res)=>{
    let {id} = req.params;
    // console.log(id);
    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created successfully");
    res.redirect("/listings/"+id);
}

module.exports.deleteReview = async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect("/listings/"+id);
}