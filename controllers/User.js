// import models
const User = require("../models/User");

// get admins
exports.getAdmins = async(req,res) => {

        try{

                // fetch data
                const admins = await User.find({accountType: 'Admin'});

                // return successful response with data
                return res.status(200).json({
                        success:true,
                        data:admins
                }); 
                
        } catch(error){

                // log the error
                console.log('Error in fetching admin data : ', error);
                
                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching admin data',
                        error:error.message,
                })

        }

}
 
// get creators
exports.getCreators = async(req,res) => {

        try{

                // fetch data
                const creators = await User.find({accountType: 'Creator'});

                // return successful response with data
                return res.status(200).json({
                        success:true,
                        data:creators
                });
                
        } catch(error){

                // log the error
                console.log('Error in fetching creator data : ', error);
                
                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching creator data',
                        error:error.message,
                })

        }

}

// get readers
exports.getReaders = async(req,res) => {

        try{

                // fetch data
                const readers = await User.find({accountType: 'Reader'});

                // return successful response with data
                return res.status(200).json({
                        success:true,
                        data:readers
                    });
                
        } catch(error){

                // log the error
                console.log('Error in fetching reader data : ', error);
                
                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching reader data',
                        error:error.message,
                })

        }

}

// get posts
exports.getPosts = async(req,res) => {

        try{

                // get user id from req 
                const {userId} = req.params;

                // id required
                if (!userId){
                        return res.status(400).json({
                                success:false,
                                message:"User id is required",
                        })
                }

                // check if user exists
                const userDetails = await User.findById(userId);
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found",
                        })
                }

                // fetch posts
                const blogs = userDetails.blogs;

                // return successful response with data
                return res.status(200).json({
                        success:true,
                        data:blogs,
                })
                
        } catch(error){

                // log the error
                console.log('Error in fetching posts : ', error);
                
                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching posts',
                        error:error.message,
                })

        }

}

// show favorites
exports.showFavorites = async(req,res) => {

        try{

                // get user id from req 
                const {userId} = req.params;

                // id required
                if (!userId){
                        return res.status(400).json({
                                success:false,
                                message:"User id is required",
                        })
                }

                // check if user exists
                const userDetails = await User.findById(userId);
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found",
                        })
                }

                // fetch favorites
                const favorites = userDetails.favorites;

                // return successful response with data
                return res.status(200).json({
                        success:true,
                        data:favorites,
                })
                
        } catch(error){

                // log the error
                console.log('Error in fetching favorites : ', error);
                
                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching favorites',
                        error:error.message,
                })

        }

}