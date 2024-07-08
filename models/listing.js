const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const default_link = "https://imgs.search.brave.com/3oIWu3uT0zVA7xnYxZtSoWkpIDtGlqBNfwg8Xe340Qo/rs:fit:200:200:1:0/g:ce/aHR0cHM6Ly9nb3Mz/LmliY2RuLmNvbS9k/MDc2YTk3MGMyOWUx/MWViYmJlZDAyNDJh/YzExMDAwNS5qcGc";
const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String,
    },
    price : Number, 
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{ 
    if(listing)
    await Review.deleteMany({_id : {$in : listing.reviews}})
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;