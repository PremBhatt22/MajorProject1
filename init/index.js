const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>console.log("Connected to DB successfully")).catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(mongo_url);
} 

const initDB = async () => {
    await Listing.deleteMany({});
    let newData = data.data.map((obj)=> ({...obj, owner : "66865214b5c4f8833fb0ac4f"}))
    await Listing.insertMany(newData);
    console.log("data was initialised");
};

initDB();