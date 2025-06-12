// not needed bec you are storing the fav in user now so that every user has its own fav

const mongoose =require("mongoose")
const favouriteSchema = mongoose.Schema({
    houseId:{
        // previously you had to import ObjectId in mongoDb but in mongoose you it will provide you
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home',
    required:true,
    unique:true
    }
})
module.exports = mongoose.model("Favourite",favouriteSchema)
    