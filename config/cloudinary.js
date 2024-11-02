const cloudinary = require("cloudinary"); // imports cloudinary lib for managing media in the cloud

exports.cloudinaryConnect = () => { // export the cloudinaryConnect func so that it can be used in other files

        try{

                cloudinary.config({ // sets the configuration of cloudinary 
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.API_KEY,
                        api_secret: process.env.API_SECRET,
                })

        } catch(error) {

                console.log("Error in connecting to cloudinary : ", error);

        }
        
};