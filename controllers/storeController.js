const Home = require("../models/home.js");
// const Favourites= require("../models/favourite.js");
// const {ObjectId} =require("mongodb")
const Favourite = require("../models/favourite.js");
const User = require('../models/user.js');
const Booking = require("../models/booking.js");
exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes)=>{
    // to remove the registeredHomes[0] you can destucture it above using ([registeredHomes,feilds]) by this you are just simply the fetched array withich contains two array which contain json data you are just naming those two array so that you can simply use them without writing registeredHomes[0] or you can just simply write ([registeredHomes]) it will assign the first array[0] to this bec you aint gonna use feild anyway
     
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      user: req.user,
      isLoggedIn:req.isLoggedIn,
    
    })
  })
};
// dont write anything in req,res,next,err feild other thean these otherwise shit wont work
exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes)=>{
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      user: req.user,
    isLoggedIn:req.isLoggedIn
    })}
  );
};

exports.getBookings = async(req, res, next) => {
const user= req.user.email;

const book=await Booking.find({userEmail:user})

const single= book.map((d)=>d.houseId)


// const func=async(d)=>{
//  dingle.push(d)
// } 

// my fuction map is syncronous prog no matter what you use, it wont return nothing when you try to use func in .then and promise pending when you return asyc stuff from with in
// const dingle1=await single.map(async(d)=>{ console.log("d",d) ;

//     Home.findOne({_id:d}).then(d=>func(d))
// both work same
//     return Home.findOne({_id:d})

// })

// using .then to make other func do stuff which is extra load
// const dingle1=await Promise.all( single.map(async(d)=>{ console.log("d",d) ;
//    return Home.findOne({_id:d}).then(d=>func(d))
// }))

// wrong bec for loop is statement not expression
// const dingle0= for(const id of single ){
//      return  await Home.findOne({_id:id})
// }
const dingle1=await Promise.all( single.map(async(d)=>{ console.log("d",d) ;
   return Home.findOne({_id:d})
}))

// right program 
// const bookk=await Booking.find({userEmail:user}).populate("houseId")
// console.log("book",book)

// const dingle =[] ;
// for(const id of single ){
//       const lo=  await Home.findOne({_id:id})
//       dingle.push(lo)
// }
// console.log("dinglr",dingle)
console.log("dinglr",dingle1)

// console.log(single)
// console.log('single',single.map(d=>{return d}).populate('d'))
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    user: req.user,
    bookingDet:dingle1,
    isLoggedIn:req.isLoggedIn
  })
};
exports.postGetBookings = async(req, res, next) => {
  // console.log("postBookings",req.body);
  const {hostEmail,houseId} = req.body
  const userEmail = req.user.email
  
  // const bookings= await Booking.findOne({hostEmail:hostEmail});
  // same 
  console.log("user",userEmail)
   const bookings= await Booking.findOne({userEmail,houseId})
   
   console.log(bookings)
   if(!bookings){
     const book = new Booking ({houseId,userEmail,hostEmail})
     book.save().then(()=>{
       console.log("booking saved");
      })
      res.redirect("/bookings")
  }else{
    console.log("alreadyBooked")
    res.render("store/alreadyBooked")
  }
  
};

exports.postAddToFavourite=async(req,res,next)=>{
  const houseId=req.body.id
  const id = req.user._id
  console.log(req.user)
  console.log("id",id)
  const user = await User.findById(id)
  console.log("user jjjjjj",user)
  if( !user.favourites.includes(houseId)){

    user.favourites.push(houseId)
     user.save().then(()=>{

       res.redirect("/favourites")
     })
  }

  /////////////////// now User schema is also used yo store fav so no need to use Favourite schema /////////////////////

// const fav = new Favourite({houseId});
// fav.save().catch((err)=>{console.log("err in fav add",err)}).finally(()=>{res.redirect("/favourites")})


}

exports.getFavouriteList = async(req, res, next) => {

  ////////////////// new code ////////////////////////////
  const id = req.user._id
  // console.log("id er",id)
  const user=await User.findById(id).populate('favourites')
  // console.log("user",user)
       res.render("store/favourite-list", {
        favouriteList:user.favourites,
        pageTitle: "My Favourites",
        currentPage: "favourites",
        user: req.user,
    isLoggedIn:req.isLoggedIn
      })
  
  // const stuff = await Favourite.find().populate("houseId").then(d=>d)
  // console.l0og(stuff)

////////////////////old one which used the favourite schema but cause one prob that every user has same fav so we stored the fav in user schema himself so that every user fav is different ///////////////


  // Favourite.find().populate("houseId").then(favourites => {
  //     const favouriteHomes=favourites.map(fav=>fav.houseId)    
  //     res.render("store/favourite-list", {
  //       favouriteList:favouriteHomes,
  //       pageTitle: "My Favourites",
  //       currentPage: "favourites",
  //       user: req.user,
  //   isLoggedIn:req.isLoggedIn
  //     })
  // }
  // )

}
      
exports.getHomeDetails=(req,res,next)=>{
  const homeId=req.params.homeId;
 
  Home.findById(homeId).then((homes)=>{
    // then(([[homes]])=>{
    // then((homes)=>{
     //const home = homes[0][0]
     
       console.log(homes)
      // console.log(home)
      if(!homes){
        console.log("not found")
        res.redirect("/homes")}
      else{
  
    res.render("store/home-detail", {
      home:homes,  
      pageTitle: "Home Deatils",
      currentPage: "Home",
      user: req.user,
    isLoggedIn:req.isLoggedIn
    })}})
  
 
 
}
exports.deleteFavourite=async(req,res,next)=>{
  const HomeId = req.params.homeId
 console.log(typeof HomeId)
 const id = req.user._id
//  const user = User.findById(id).populate('favourites')
// why are you populating it you are deleting it
 const user =await User.findById(id)
 if(user.favourites.includes(HomeId)){
  
  // user.favourites=user.favourites.filter(d=>d != HomeId)
  // both of these are same (d=>d != HomeId) || (d=>d.toString() !== HomeId)
  user.favourites=user.favourites.filter(d=>d.toString() !== HomeId)
  // console.log("user",user.favourites.ObjectId) // wont work dumbass
 await user.save()
   res.redirect("/favourites")
 }

//////////////////old code/////////////////////////

  // Favourite.findOneAndDelete({houseId:HomeId}).then((err)=>{
  //   console.log("removed from fav")
  
  // }).finally(()=>{  res.redirect("/favourites");})
  // res.redirect("/favourites");
 }


