// gen knowledge if you ae sending something throuh a heref method it wnt work in post you will have to use get
// Core Module
const path = require('path');

// External Module
require('dotenv').config({
    path: './.env'
  });
const express = require('express');
const session = require("express-session")
const parser = require('cookie-parser')
const multer = require("multer")
// const multer = require("multer")()

//Local Module
const {fileFilter,ranString}=require("./utils/multerFunctions.js")
const storeRouter = require("./routes/storeRouter.js")
const hostRouter = require("./routes/hostRouter.js")
const authRouter = require("./routes/authRouter.js")
const rootDir = require("./utils/pathUtil.js");
const errorsController = require("./controllers/errors.js");


const { default: mongoose } = require('mongoose');
const mongodbStore =require('connect-mongodb-session')(session)
const store=new mongodbStore({
  uri:process.env.URL,
  collection:'sessions'
});
const app = express();
app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  // cookie:{maxAge:86400000}// means the time for the session to remain this 8640000 milli sec is 24 hours
  store:store // you used connect-mongodb-session and stored the session in that file in data base look at line 18
}))
app.use((req,res,next)=>{
  // with cookie parser middleware instead of req.get("Cookie") raw return string undefined works if you saved oly one cookie you can still use it form many by using split etc but you can use req.cookies after embedding cookie parser middleware you can get object which are simple to use just access with .  whatevere.cookie
  // console.log("cookie",req.get("Cookie"),"cookie2",req.cookies)
  // req.isLoggedIn=req.get('cookie')?.split('=')[1] || false;
    // req.isLoggedIn=req.get('cookie')[0]? req.get('cookie').split('=')[1]=== "true" : false;
        req.isLoggedIn=req.session.isLoggedIn;
        
        req.user=req.session.user; 
    //  console.log(isLoggedIn)
  next()
})
app.use(parser())
app.set('view engine', 'ejs');
app.set('views', 'views');

const storage=multer.diskStorage({
 destination: function (req, file, cb) {
   
    cb(null, 'my-uploads/')
  },
filename:(req,file,cb)=>{
  // cb(null,new Date().toISOString()+'_'+file.originalname)
  //// .toISOStrig is not working
  cb(null,ranString(10) + '-' + file.originalname)
}
})

// const multerOptions={
//   // dest:'uploads/',
//   storage:storage
// }
//  app.use(multer({ dest:'uploads/'}).single('photo'));
// both are same i just made the obj outside
app.use(multer({storage:storage,fileFilter}).single('photo'));

app.use(express.urlencoded());


 app.use(express.static(path.join(rootDir, 'public')));
 app.use('/my-uploads',express.static(path.join(rootDir, 'my-uploads')));
 app.use('/host/my-uploads',express.static(path.join(rootDir, 'my-uploads')));
 app.use('/homes/my-uploads',express.static(path.join(rootDir, 'my-uploads')));

app.use(storeRouter);
app.use(authRouter);
app.use("/host", (req,res,next) =>{
  
  if(req.isLoggedIn){
   next();
  // hostRouter
}
   else{
    res.redirect("/login")
   }
} );
app.use("/host",hostRouter);


app.use(errorsController.pageNotFound);

// mongoConnect.mongoConnect().then(()=>{app.listen(PORT, () => {
//   console.log(`Server running on address http://localhost:${PORT}`);
// });})

// previous in database util we extracted the data base after connecting it here we are just putting the db name in url so we dont have to do  it after .net/<dbName>?retryWrites

mongoose.connect(process.env.URL).then(() => {
  console.log("connected to MongoDB")
  app.listen(process.env.PORT, () => {
    console.log(`Server running on address http://localhost:${process.env.PORT}`);
  })
}).catch((Err) => {
  console.log("errr while connecting to mongo", Err)
})
// mongoConnect(client =>{app.listen(PORT, () => {
//   console.log(`Server running on address http://localhost:${PORT}`);
// });
// })

//my code
// const express = require("express");
// const app= express();
// const path= require("path");
// const {homeRouts} = require("./routes/home.js")
// const {contactRoutes,arr}= require("./routes/contactUS.js")
// const {error1} = require("./controllers/404.js")


// // how u use implement ejs in express js
// app.set('view engine','ejs')
// app.set("views","views")
// //
// app.use(homeRouts)
// app.use(express.static(path.join(__dirname,"./","public")))// to use public folder so that you can use css etc
// app.use(express.urlencoded());
// app.use(contactRoutes);

// app.use(error1)
// const PORT=3000;
// app.listen(PORT,()=>{
//     console.log("http://localhost:3000")
// })