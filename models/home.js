const mongoose = require("mongoose");
// const Favourite = require("./favourite");

const homeSchema=mongoose.Schema({
  houseName:{
    type:String,
     required:true  
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  rating:{
    type:Number,
    required:true
  },
  photo:String,
  description:String,
  hostEmail:{
    type:String,
    required:true
  },
   photoId:{
    type:String,
    required:true
  }
});
// homeSchema.pre("deleteOne",async function(next){
//   const homeId = this.getQuery()._id;
//   await Favourite.deleteMany({houseId:homeId});
// })

module.exports= mongoose.model("Home",homeSchema);
/**
 * this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description=description;
 * 
 * 
 * save()
 * find()
 * findById(homeId)
 * deleteById(homeId)
 */
