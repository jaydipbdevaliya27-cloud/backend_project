import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return console.log("Local file path not found");
        // file uploaded on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type :"auto "
        }).then((response) => {
            console.log("File uploaded successfully",response.url);
            return response;
        })
        
    }
    catch(error) {
        //this removes the locally saved file as upload operation got failed
        fs.unlinkSync(localFilePath);
        console.log("CloudinaryError :",error);
        return 
    }
}

export {uploadOnCloudinary}