// External Module
const express = require("express");
const authRouter = express.Router();
// gen knowledge if you ae sending something throuh a heref method it wnt work in post you will have to use get
// dont write anything in req,res,next,err feild other thean these otherwise shit wont work
// Local Module
const authController = require("../controllers/authController.js");
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/logout", authController.getLogout);
authRouter.get("/signup", authController.getSignUp);
authRouter.post("/signup", authController.postSignUp);

module.exports = authRouter;

// my code
// const express = require("express");
// const contactRoutes= express.Router();
// const path = require("path");
// const contact= require("../controllers/contact.js")
// contactRoutes.get('/contact-us',(req,res)=>{
//     // res.send("hello");
//     // i am using false as contactus Page and true as home page
//     res.render("contactus",{pageTitle:"contactUs",currentPage:"contactUs"})
//      });

   
//  contactRoutes.post('/contact-us',contact.PostAddHome)


//     exports.contactRoutes= contactRoutes;
   