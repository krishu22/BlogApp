// import the models
const Rating = require("../models/Rating");
const User = require("../models/User");
const Blog = require("../models/Blog"); 

// create rating
exports.createRating = async(req,res) => {

        try{

                // get user id
                const {userId} = req.body;

                // fetch data from req body
                const {rating,blogId} = req.body;

                // check if user exists
                const userDetails = await User.findById(userId);
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found",
                        });
                }

                // check if blog exists
                const blogDetails = await Blog.findById(blogId);
                if (!blogDetails){
                        return res.status(404).json({
                                success:false,
                                message:"Blog not found",
                        });
                }

                // check if user already reviewed the course
                const alreadyReviewed = await Rating.findOne({
                        creator:userId,
                        blog:blogId,
                });
                if (alreadyReviewed){
                        return res.status(403).json({
                                success:false,
                                message:"Blog is already reviewed by the user",
                        });
                }

                // create rating
                const newRating = await Rating.create({
                        rating,
                        blog:blogId,
                        creator:userId,
                });

                // update blog schema
                const updatedBlogDetails = await Blog.findByIdAndUpdate({_id:blogId},{
                        $push:{
                                ratings:newRating._id,
                        }
                }, {new:true});

                // update user schema
                const updatedUserDetails = await User.findByIdAndUpdate({_id:userId},{
                        $push:{
                                ratings:newRating._id,
                        }
                }, {new:true});

                // return successful response with new rating data
                return res.status(200).json({
                        success:true,
                        message:"Rating created successfully", 
                        data:newRating,
                })
                
        } catch(error){

                // log the error
                console.log('Error in creating rating: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in creating rating',
                        error:error.message,
                })

        }

}

// get avg ratings on a post
/*
exports.getAverageRating = async(req,res) => {

        try{
                
        } catch(error){

                // log the error
                console.log('Error in getting avg rating: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in getting avg rating',
                        error:error.message,
                })

        }

}*/

// get all on a post
exports.getBlogRatings = async(req,res) => {

        try{

                // fetch blog id from params
                const {blogId} = req.params;

                // check if blog exists or not
                const blogDetails = await Blog.findById(blogId);
                if (!blogDetails){
                        return res.status(404).json({
                                success:false,
                                message:"Blog not found"
                        })
                }

                // fetch all ratings
                const ratingData = blogDetails.ratings;

                // return response with data
                return res.status(200).json({
                        success:true,
                        message:"Ratings fetched successfully",
                        data:ratingData,
                })
                
        } catch(error){

                // log the error
                console.log('Error in getting ratings on this post: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in getting ratings on this post',
                        error:error.message,
                })

        }

}

// get all ratings done by a user 
exports.getUserRatings = async(req,res) => {

        try{

                // fetch user id from body
                const {userId} = req.params;

                // check if user exists or not
                const userDetails = await User.findById(userId);
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found"
                        })
                }

                // fetch all ratings
                const ratingData = userDetails.ratings;

                // return response with data
                return res.status(200).json({
                        success:true,
                        message:"Ratings fetched successfully",
                        data:ratingData,
                })
                
        } catch(error){

                // log the error
                console.log('Error in getting all ratings done by the user: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in getting all ratings done by the user',
                        error:error.message,
                })

        }

}