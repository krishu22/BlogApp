const cloudinary = require("cloudinary").v2; // import v2 version of cloudinary library for managing media

const imageUploader = async (file,folder,height,quality) => {

        // file : object that contains the img to be uploaded
        // folder : folder in cloudinary where the img should be stored
        // height : optional param to which height should be resized
        // quality : specifies quality of uploaded image

        const options = {folder};

        if (height) {
                options.height = height;
        }

        if (quality) { 
                options.quality = quality;
        }

        options.resource_type = "auto"; // allows cloudinary to automatically detect the resource type (img/vdo/etc)

        return await cloudinary.uploader.upload(file.tempFilePath, options);
        // uploads the image to cloudinary using the uploader.upload method
        // file.tempFilePath: The temporary file path of the image to be uploaded.
        // await - wait for the upload operation to complete ; asynchronous, it returns a promise

}

module.exports = imageUploader;