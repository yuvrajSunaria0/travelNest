const mongoose = require("mongoose");
// const favourite = require("./favourite");
// const Favourite = require("./favourite");

const userSchema=mongoose.Schema({
  firstName:{
    type:String,
     required:[true,'First name is required']  
  },
  
//   lastName:{
//     type:String,
     
//   },
  lastName:String,
  email:{
    type:String,
     required:[true,'email is required'],
     unique:true  
  },
  password:{
    type:String,
    required:true
  },
 userType:{
    type:String,
    enum:['guest','host'],
    default:"guest"
 },

 // addded fav here so that every user has its own fav so no need for that favourite model
 favourites:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Home"
 }]

});


module.exports= mongoose.model("User",userSchema);