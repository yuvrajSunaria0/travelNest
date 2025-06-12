const mongoose = require("mongoose")

const bookingSchema=  mongoose.Schema({
houseId:{
     type : mongoose.Schema.Types.ObjectId,
     ref:"Home"
},
userEmail:{
    
    type:mongoose.Schema.Types.String,
    ref:"User",    
},
hostEmail:{
    type:mongoose.Schema.Types.String,
    ref:"User"
}

})

module.exports= mongoose.model("Booking",bookingSchema)