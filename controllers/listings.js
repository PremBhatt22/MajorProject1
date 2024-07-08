const Listing = require("../models/listing.js"); //Listing Schema
const {listingSchema, reviewSchema} = require("../schema.js"); //Joi

module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path : "author"
        }
    })
    .populate("owner");

    // console.log(listing);
    if(!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req,res,next)=>{

    let url = req.file.path;
    let filename = req.file.filename;

    let result = listingSchema.validate(req.body);
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    
    newListing.image.url = url;
    newListing.image.filename = filename;
    
    console.log(result);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings")
    }   
    let OrgUrl = listing.image.url;
    OrgUrl.replace("/upload", "/upload/h_250,w_300");
    res.render("listings/edit.ejs",{listing , OrgUrl});
}

module.exports.updateListing = async (req, res)=> {
    let {id} = req.params;
    if(!req.body.listing) throw new ExpressError(400, "Please send valid data!");
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;
        
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "listing updated successfully");
    res.redirect("/listings/"+id);
}

module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
}