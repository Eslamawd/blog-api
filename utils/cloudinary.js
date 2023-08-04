const cloudinary = require("cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const cloudinaryUploadImage = async(fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
        })
        return data
        

    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (cloudinary)");
    }
}

const cloudinaryRemoveAllImage = async(paplicIds) => {
    try {
        const result = await cloudinary.v2.api.delete_resources(paplicIds)
        return result
        
    } catch (error) {
      
        console.log(error);
        throw new Error("Internal Server Error (cloudinary)");
    }
}


const cloudinaryRemoveImage = async(imagePaplicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePaplicId)
        return result
        
    } catch (error) {
      
        console.log(error);
        throw new Error("Internal Server Error (cloudinary)");
    }
}


module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveAllImage
}