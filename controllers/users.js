const User = require('../models/user.js');

module.exports.renderSignup =  (req, res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.signup = async (req, res)=>{

    try {

        let {username, email, password} = req.body;
        const newUser = new User({
            email : email,
            username : username
        });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err) {
                return next(err);
            }
            req.flash("success", "User registered successfully");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    } catch(e) {
        req.flash("error", "username already exists");
        res.redirect("/signup");
    }
}

module.exports.renderLogin =  (req, res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.login = async (req, res)=>{
    req.flash("success", "Welcome back To TourGifty! You Are logged in");
    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success", "User logged out successfully");
        res.redirect("/listings");
    })
}