// import models
const User = require("../models/User");
const Profile = require("../models/Profile");

const imageUploader = require("../utils/imageUploader")

// update profile
exports.updateProfile = async(req,res) => {

        try{

                // get data from req body
                const {dateOfBirth="", about="", contactNumber, gender} = req.body;
                const {email} = req.body;

                // validation (all fields req)
                if (!email || !contactNumber || !gender){
                        return res.status(400).json({
                                success:false,
                                message:"All fields required"
                        })
                }

                // find profile 
                const userDetails = await User.findOne({email});

                // check if user exists or not
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found"
                        })
                }

                // update profile
                const profileId = userDetails.additionalDetails;
                const profileDetails = await Profile.findById(profileId);
                profileDetails.dateOfBirth = dateOfBirth;
                profileDetails.about = about;
                profileDetails.gender = gender;
                profileDetails.contactNumber = contactNumber;

                // save (jis cheej me changes kie h usko save kro)
                await profileDetails.save();

                // return successful response with new data
                return res.status(200).json({
                        success:true,
                        message:"Profile updated successfully",
                        data:profileDetails,
                })
                
        } catch(error){

                // log the error
                console.log('Error in updating profile: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in updating profile',
                        error:error.message,
                })

        }

} 

// update pfp
exports.updateProfilePicture = async(req,res) => {

        try{

                // fetch new pfp from req files
                const displayPicture = req.files.displayPicture;

                // get user id from req body
                const {email} = req.body;
                const userDetails = await User.findOne({email});

                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"user not found"
                        })
                }

                // upload new img to cloudinary folder
                const image = await imageUploader(
                        displayPicture,
                        process.env.CLOUD_NAME,
                        1000,
                        1000
                )

                // find user by id and update the picture
                const updatedProfile = await User.findByIdAndUpdate(
                        { _id: userDetails._id },
                        { image: image.secure_url },
                        { new: true }
                )

                // send successful response
                return res.status(200).json({
                        success: true,
                        message: `Image Updated successfully`,
                        data: updatedProfile,
                })
                
        } catch(error){

                // log the error
                console.log('Error in updating profile picture: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in updating profile picture',
                        error:error.message,
                })

        }

}

// delete user
exports.deleteUser = async(req,res) => {

        try{

                // get user id
                const {userId} = req.params;

                // validation
                const userDetails = await User.findById({_id:userId});
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found"
                        });
                }

                // delete profile
                await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

                // delete user
                await User.findByIdAndDelete({_id:userId});

                // delete blogs, comments, ratings as well

                // return response
                return res.status(200).json({
                        success:true,
                        message:"User deleted successfully",
                })
                
        } catch(error){

                // log the error
                console.log('Error in deleting user: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in deleting user',
                        error:error.message,
                })

        }

}

// get a user
exports.getUser = async(req,res) => {

        try{

             /*   // get id
                const {userId} = req.user.id;

                // validation and get user details
                const userDetails = await User.findById(userId)
                                .populate("additionalDetails")
                                .populate("blogs")
                                .exec();*/

                const {email} = req.body;

                const userDetails = await User.findOne({email})
                                        .populate("additionalDetails")
                                        .populate("blogs")
                                        .exec();

               // userDetails.password = undefined; // response object me password send ni hoyega
                
                // return successful response with data
                return res.status(200).json({
                        success:true,
                        message:"User data fetched successfully",
                        data: userDetails,
                })
                
        } catch(error){

                // log the error
                console.log('Error in getting user details: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in getting user details',
                        error:error.message,
                })

        }

}
