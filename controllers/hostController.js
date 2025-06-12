const { ObjectId } = require("mongodb")
const Home = require("../models/home.js");
const Booking = require("../models/booking.js");
const {cloudinaaryUpload,cloudinaryDestroy}= require("../utils/cloudinary.js")
const User = require("../models/user.js");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
         user:  req.user,

    isLoggedIn:req.isLoggedIn
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;// this will be the id after the ? is query editing=true etc ex (http://localhost:3000/host/edit-home/1?editing=true)
  const editing = req.query.editing === "true";
  Home.findById(homeId).then((home) => {
    console.log(home)
    if (!home) {
      console.log("home not found");
      return res.redirect("/host/host-home-list")
    }
    else {

      res.render("host/edit-home", {
        home: home,
        pageTitle: "Edit your Home",
        currentPage: "addHome",
        editing: editing,
              user:  req.user,

    isLoggedIn:req.isLoggedIn
      });
    }
  })

};

exports.getHostHomes = (req, res, next) => {

  Home.find().then(registeredHomes => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
            user:  req.user,

      currentPage: "host-homes",
    isLoggedIn:req.isLoggedIn
    })
  }
  );



};

exports.postAddHome = async (req, res, next) => {
    console.log("home",req.file)
    if(!req.file){
      return res.status(422).send('no image provided')
    }
  const { houseName, price, location, rating, description } = req.body;
 const localPath = req.file.path;
 const result= await cloudinaaryUpload(localPath)
 console.log("result",result)
 const photo = result.url
 const photoId = result.public_id
 const hostEmail=req.user.email
  // const home = new Home({ houseName:houseName, price:price, location:location, etc because value and names in schema are same you dont have to do this u just simply write them  
  const home = new Home({ houseName, price, location, rating, photo, description,hostEmail,photoId });

    
  home.save().then((lol) => {
    console.log("lol", lol);
    console.log("home saved")
  }).catch((err) => { console.log("err", err) })

  // res.render("host/home-added", {
  //   pageTitle: "Home Added Successfully",
  //   currentPage: "homeAdded",
  // });
  res.redirect("/host/host-home-list");
}

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  //  const photo = req.file.path; //will crash bec if you are not editing photo the req.fie will be empty so put req.file in the if statement
   
  Home.findById(id).then(async(home) => {
    home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      // home.photo = photo, //old
      
      home.description = description;
      if(req.file){
        
         const details=await cloudinaaryUpload(req.file.path);
          const result=await cloudinaryDestroy(home.photoId)
          console.log("delete status",result.result)
      home.photo = details.secure_url
      home.photoId = details.public_id
      
      }
      
  home.save().then(result => {
    console.log("home Updattttttt", result)
  }).catch((err)=>{
    console.log("err while updating",err)
  })

  res.redirect("/host/host-home-list");
  }).catch((err)=>{
    console.log("err while finding home",err)})

};
// dont write anything in req,res,next,err feild other thean these otherwise shit wont work
exports.postDeleteHome = (req, res, next) => {

  const homeId = req.params.homeId;
  const lol =new ObjectId(String(homeId))
console.log(lol)
     Home.findById(homeId).then(async(d)=>{
      cloudinaryDestroy(d.photoId)
     
     }).then(()=>{
  Home.deleteOne({_id:lol}).then(d => res.redirect("/host/host-home-list")).catch((err) => {
    console.log("error while deleting", err)
  })})

  // Favourites.removeFav(homeId,(err)=>{
  //   console.log(err)

  // })
  // my ver half finished
  //  Home.find((data)=>{
  //   const arr = data.filter(d=>d.id!=home);

  //   callback
  //   arr.save()

  //  })
  // res.render("host/home-added", {
  //   pageTitle: "Home Added Successfully",
  //   currentPage: "homeAdded",
  // });

}
exports.getBookingRequest=async(req,res,next)=>{
  const hostEmail = req.user.email;
const booking = await Booking.find({hostEmail:hostEmail}).populate("houseId")
const userInfo = booking.map(d=>{ return d.userEmail})

 const userDetails= await Promise.all(userInfo.map((d)=>{
  return User.findOne({email:d})
}))
// console.log(userDetails)
const mix=booking.map((d,index)=>{
  return{
    user:userDetails[index],
    booking:d
  }
})
// console.log("mix",mix)
// console.log("user",userDetails)
// console.log("user",userInfo)
// console.log(booking)

res.render("host/bookingRequest", {
     
      pageTitle: "bookingRequest",
            user:  req.user,
        bookingDet:mix,
      currentPage: "bookingRequest",
    isLoggedIn:req.isLoggedIn,
    
    })

}
exports.postDeleteBooking=(req,res,next)=>{
   const hme  = req.params.homeId
   console.log(hme)
  //  Home.deleteOne({_id:lol})
   Booking.deleteOne({_id:hme}).then(()=>res.redirect("/host/bookingRequest"))
  
}