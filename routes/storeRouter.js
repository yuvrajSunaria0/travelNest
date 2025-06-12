// External Module
const express = require("express");
const storeRouter = express.Router();
// gen knowledge if you ae sending something throuh a heref method it wnt work in post you will have to use get
// dont write anything in req,res,next,err feild other thean these otherwise shit wont work
// Local Module
const storeController = require("../controllers/storeController.js");
const favourite = require("../models/favourite.js");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.post("/bookings", storeController.postGetBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);
// dynamic path according to id of card
storeRouter.get("/homes/:homeId",storeController.getHomeDetails);
// it is 
storeRouter.post("/favourites",storeController.postAddToFavourite);
storeRouter.post("/favourite/delete/:homeId",storeController.deleteFavourite);

module.exports = storeRouter;

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
   