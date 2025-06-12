exports.fileFilter=(req,file,cb)=>{
  // if(['image/png',"image/jpg","image/jpeg","image/heif"].includes(file.mimetype))
    //  this way or this
  if(file.mimetype === 'image/png'||file.mimetype==="image/jpg"||file.mimetype==="image/jpeg"||file.mimetype==="image/heif"){
     cb(null,true);
  }else{
    cb(null,false);
  }

}


exports.ranString = (length) =>{
  const aee = "qwertyuiopasdfghjklzxcvbnm"
   let result ='';
   for (let index = 0; index <= length; index++) {
  result += aee.charAt(Math.floor(Math.random() * 26 ))
   }
 return result;
}