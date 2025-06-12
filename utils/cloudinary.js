const cloudinary= require("cloudinary").v2
const fs = require("fs")
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret
});
exports.cloudinaaryUpload= async (localFilePath)=>{
    console.log("local file path",localFilePath);
    try {
        if(!localFilePath){
            return console.log("no file path")
        }
        // upload file on cloudinary
        else{
            // cloudinary.v2.uploader.upload is given in the documentation on its website but you imported it as a v2
      const response= await  cloudinary.uploader.upload(localFilePath,{ resource_type:"auto" }).then((d)=>{
          fs.unlink(localFilePath,(err)=>{
            if(err){
                console.log("failed to elete local file",err)
            }
            else{
                console.log("local file deleted")
            }
          })
          return d
      })

    //    console.log("url",response.url)
       return response
    }
    } catch (error) {
        // this will unlink the file synchrnously means it will block the javascript loop which is but this is what we need we need to unlink the file before moving on otherwise fs.unlink it wil unlink stuff async 
        
        fs.unlinkSync(localFilePath)// remove the locally save temp file as the upload operation got failed
        return console.log("not able to upload")
    }
}
 
exports.cloudinaryDestroy= async(id)=>{
    try {
        const output=   await cloudinary.uploader.destroy(id, {resource_type:"image"})
     
     return output
    } catch (error) {
        console.log("not able to delete the image ",error)
    }
 
}

