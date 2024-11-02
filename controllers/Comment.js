// import models
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const User = require("../models/User");

// create comment
exports.createComment = async(req,res) => {

        try{
                
                // get blog id from params
                const {blogId} = req.params; 
                
                // fetch data from req body
                const {email, content} = req.body;

                // validation (all fields required)
                if (!blogId || !email || !content){
                        return res.status(400).json({
                                success:false,
                                message:"All fields are required",
                        });
                }

                // check if user and blog exist or not
                const userDetails = await User.findOne({email});
                const blogDetails = await Blog.findById(blogId);
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found",
                        });
                }
                if (!blogDetails){
                        return res.status(404).json({
                                success:false,
                                message:"Blog not found",
                        });
                }

                // create comment
                const comment = await Comment.create({
                        creator:userDetails._id,
                        blog:blogDetails._id,
                        content,
                })

                // add comment to blog schema
                await Blog.findByIdAndUpdate(
                        {_id:blogDetails._id},
                        {$push:{comments:comment._id}},
                        {new:true}
                )

                // add comment to user schema
                await User.findByIdAndUpdate(
                        {_id:userDetails._id},
                        {$push:{comments:comment._id}},
                        {new:true}
                )

                // return successful response with comment data
                return res.status(200).json({
                        success:true,
                        message:"Comment created successfully",
                        data:comment,
                });
                
        } catch(error){

                // log the error
                console.log('Error in creating comment: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in creating comment',
                        error:error.message,
                })

        }

}

// delete comment
exports.deleteComment = async(req,res) => {

        try{

                // get comment id from req body
                const {commentId} = req.body;

                // delete
                await Comment.findByIdAndDelete(commentId);

                // delete comment from other schemas as well

                // return successful response
                return res.status(200).json({
                        success:true,
                        message:"Comment deleted successfully",
                })

        } catch(error){

                // log the error
                console.log('Error in deleting comment: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in deleting comment',
                        error:error.message,
                })

        }

}
 
// show all comments on a post
exports.showCommentsOnBlog = async(req,res) => {

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

                // fetch all comments
                const commentData = blogDetails.comments;

                // return response with data
                return res.status(200).json({
                        success:true,
                        message:"Comments fetched successfully",
                        data:commentData,
                })
                
        } catch(error){

                // log the error
                console.log('Error in showing comments on this blog: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in showing comments on this blog',
                        error:error.message,
                })

        }

}

// show a user's comments
exports.showUserComments = async(req,res) => {

        try{

                // fetch user id from body
                const {userId} = req.body;

                // check if user exists or not
                const userDetails = await User.findById(userId);
                if (!userDetails){
                        return res.status(404).json({
                                success:false,
                                message:"User not found"
                        })
                }

                // fetch all comments
                const commentData = userDetails.comments;

                // return response with data
                return res.status(200).json({
                        success:true,
                        message:"Comments fetched successfully",
                        data:commentData,
                })
                
        } catch(error){

                // log the error
                console.log('Error in fetching user comments: ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching user comments',
                        error:error.message,
                })

        }

}