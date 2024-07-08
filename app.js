//All Necessary Imports

if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const port = 8080;
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/expressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//We are making router paths to make the app look less bulky..
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';

// const map = new maplibregl.Map({
//     container: 'map', // container id
//     style: 'https://demotiles.maplibre.org/style.json', // style URL
//     center: [0, 0], // starting position [lng, lat]
//     zoom: 1 // starting zoom
// });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate); 

const dbURL = process.env.MONGO_ATLAS_LINK;

main().then((res)=>console.log("Connected to DB successfully")).catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(dbURL);
} 


const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter: 24*60*60
});

store.on("error", ()=>{
    console.log("Error in mongo session store ", err);
});

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }  
};


//Listens for root page
// app.get('/',(req, res)=>{
//     res.render("listings/GoToListings.ejs");
// });


app.use(session(sessionOptions));
app.use(flash());

//Configuring Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Configuring Flash Messages - Saving them in locals and using in flash.ejs file 
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//User for authentication Route
// app.get("/demoUser", async (req, res)=>{
//     let newUser = new User({
//         email : "mrbhatt201020@gmail.com",
//         username : "prem-bhatt"
//     });
//     let registeredUser = await User.register(newUser, "helloworld"); //here helloworld is password
//     res.send(registeredUser);
// });

//Using router for Listings
app.use("/listings", listingsRouter);  

//Using router or reviews
app.use("/listings/:id/reviews", reviewsRouter);

//using router for new login/signup
app.use("/", userRouter);






//kisi ke bhi saath match nahi hua request path
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Does Not Exist...   : ("));
});

//Our error handling middleware
app.use((err, req, res, next)=>{ 
    let {status = 401, message = "Some Error Occured"} = err;
    // res.status(status).send(message);
    res.render("error.ejs",{status,message});
});

app.listen(port, ()=>{
    console.log("app is listening on port "+port);
});
