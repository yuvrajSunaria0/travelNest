 // External Module
const express = require("express");
const hostRouter = express.Router();
// dont write anything in req,res,next,err feild other thean these otherwise shit wont work
// gen knowledge if you ae sending something throuh a heref method it wnt work in post you will have to use get
// Local Module

const hostController = require("../controllers/hostController.js");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.get("/bookingRequest", hostController.getBookingRequest);
hostRouter.post("/delete-booking/:homeId", hostController.postDeleteBooking);
 hostRouter.post("/edit-home", hostController.postEditHome);
 hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;

// my code

// // always put try and catch in router routes etc bec you got stuck in this shit bec you didnt know where this error was coming from
// const express = require("express");
// const homeRouts=express.Router();
// const path = require("path");
// const AddHome= require("../controllers/homes.js")
// try {
//     // const AddHome= require("../controllers/contact.js")
// // homeRouts.get("/",AddHome.getAddHome)

// homeRouts.get("/",AddHome)
// } catch (error) {
//     console.log("error is happening routes file",error)
// }



// exports.homeRouts=homeRouts;