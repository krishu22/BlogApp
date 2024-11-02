// import models
const Blog = require("../models/Blog"); 
const Category = require("../models/Category");
const User = require("../models/User");

// function to upload image to cloudinary
const {uploadImageToCloudinary} = require("../utils/imageUploader");

// create a blog
exports.createBlog = async (req,res) => {
 
        try{
 
                // get user id from req object
                const {email} = req.body;

                // fetch data from req body
                const {
                        title,
                        tags,
                        category,
                        content,
                } = req.body;
/*
                // fetch thumbnail from req files
                const thumbnail = req.files.thumbnailImage;

                if (!thumbnail){
                        return res.json({
                                message:"image missing"
                        })
                }
*/
                // validation (all fields required)
                if (!title || !tags || !category || !content){
                        return res.status(400).json({
                                success:false,
                                message:"All fields are required",
                        })
                }

                // check if user is a creator or admin
                const userDetails = await User.findOne({
                        email,
                        $or: [
                                {accountType: "Creator"},
                                {accountType: "Admin"}
                        ]
                });
                console.log("User details : ", userDetails);
                if (!userDetails){
                        return res.status(400).json({
                                success:false,
                                message:"Only creators and admins can create a blog.",
                        })
                }
/*
                // check if category is valid or not
                for (const categoryName in category){
                        categoryDetails = await Category.findOne({name:categoryName});
                        if (!categoryDetails){
                                res.status(404).json({
                                        success:false,
                                        message:"All categories must be valid",
                                })
                        }
                }    

                // upload img to cloudinary
                const thumbnailImageUpload = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
                console.log("Thumbnail image : ", thumbnailImageUpload);

                
*/

                // Check if categories are valid
        const categoryArray = Array.isArray(category) ? category : [category];
        const invalidCategories = [];
        const validCategoryIds = [];

        for (const categoryName of categoryArray) {
            const categoryDetails = await Category.findOne({ name: categoryName });
            if (!categoryDetails) {
                invalidCategories.push(categoryName);
            } else {
                validCategoryIds.push(categoryDetails._id);
            }
        }

        if (invalidCategories.length > 0) {
            return res.status(404).json({
                success: false,
                message: `The following categories are invalid: ${invalidCategories.join(', ')}`,
            });
        }

                // create an entry for the new blog with the given details
                const newBlog = await Blog.create({
                       // thumbnail:thumbnailImageUpload.secure_url,
                        title,
                        content,
                        category:validCategoryIds,
                        tags,
                        creator:userDetails._id, //creator:userId,
                })

                // add blog id to user schema of the creator/admin
                await User.findByIdAndUpdate(
                        userDetails._id,
                        {$push: {blogs:newBlog._id}},
                        {new:true}
                );

                // add blog id to the category schema
            /*    for (let categoryName in category){
                        const categoryDetails = await Category.findOne({categoryName});
                        await Category.findByIdAndUpdate(
                                {_id: categoryDetails._id},
                                {$push:{blogs:newBlog._id}},
                                {new:true},
                        )
                };*/

                for (const categoryId of validCategoryIds) {
                        await Category.findByIdAndUpdate(
                            categoryId,
                            { $push: { blogs: newBlog._id } },
                            { new: true }
                        );
                    }

                // return response and the new blog
                return res.status(200).json({
                        success:true,
                        message:"Blog created successfully.",
                        data:newBlog,
                })

        } catch(error){

                // log the error
                console.log("Error in creating blog : ", error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:"Failed to create blog",
                        error:error.message,
                });

        }
        
}

// get a blog
exports.getBlogDetails = async(req,res) => {

        try{

                // fetch blog id from url
                const {blogId} = req.params;

                // find blog details by populating all references
                const blogDetails = await Blog.find({_id:blogId})
                        .populate("creator")
                        .populate("category")
                        .populate("ratings")
                        .populate("likes")
                        .populate("comments")
                        .exec();

                // validation (blog details not found)
                if (!blogDetails){
                        return res.status(400).json({
                                success:false,
                                message:`Could not find the blog ${blogId}`,
                        });
                }

                // return response with blog details
                return res.status(200).json({
                        success:true,
                        message:"Blog details fetched successfully",
                        data: blogDetails,
                })
                
        } catch(error){

                // log the error
                console.log('Error in getting the blog : ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching blog',
                        error:error.message,
                })

        }

}

// show all blogs
exports.showAllBlogs = async(req,res) => {

        try{

                // fetch all blogs and populate the creator field
                const allBlogs = await Blog.find(
                        {}, 
                        {
                                creator:true,
                                thumbnail:true,
                                title:true,
                                content:true,
                                category:true,
                                tags:true,
                        }
                )
                .populate("creator")
                .exec();

                // return successful response with data
                return res.status(200).json({
                        success:true,
                        message:"Data of all blogs fetched successfully",
                        data:allBlogs,
                })
                
        } catch(error){

                // log the error
                console.log('Error in fetching all blogs : ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in fetching all blogs',
                        error:error.message,
                })

        }

}

// delete a blog
exports.deleteBlog = async(req,res) => {

        try{

                // fetch id from params
                const {blogId} = req.params;

                // fetch user id
                const {userId} = req.body; // only creator can delete that blog

                // fetch user
                const userDetails = await User.findById(userId);

                // check if user is the creator of blog
                if (!userDetails.blogs.includes(blogId)){
                        return res.status(404).json({
                                success:false,
                                message:"blog doesnt belong to the user",
                        })
                }

                // find by id and delete
                await Blog.findByIdAndDelete(blogId);

                // do i need to delete the entry from other schemas ? YES

                // return successful response
                return res.status(200).json({
                        success:true,
                        message:"Blog deleted successfully",
                })
                
        } catch(error){

                // log the error
                console.log('Error in deleting blog : ', error);

                // unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in deleting blog',
                        error:error.message,
                })

        }

}

// edit a blog
exports.editBlog = async(req,res) => {

        try{

                // fetch blog id from req params
                const {blogId} = req.params;

                // fetch user id
                const {email} = req.body;

                // fetch user
                const userDetails = await User.findOne({email});

                // validation
                if (!userDetails){
                        return res.json({
                                success:false,
                                message:"User doesnt exist",
                        });
                }

                // check if user is the creator of blog
                if (!userDetails.blogs.includes(blogId)){
                        return res.status(404).json({
                                success:false,
                                message:"Blog does not belong to user",
                        })
                }

                // fetch new data from req body
                const {title, content} = req.body;

                // find the blog that has to be updated
                const blog = await Blog.findById(blogId);

                // if blog does not exist
                if (!blog){
                        return res.status(404).json({
                                success:false,
                                message:"Blog not found",
                        })
                }
 
                // if the variables are not undefined, update them
                if (title !== undefined){
                        blog.title = title;
                }
                if (content !== undefined){
                        blog.content = content;
                }

                // if an image is there
                if (req.files && req.files.newThumbnail !== undefined) {
                        // upload the image to cloudinary
                        const newThumbnail = req.files.newThumbnail;
                        const uploadDetails = await uploadImageToCloudinary(
                                newThumbnail,
                                process.env.FOLDER_NAME
                        )
                        // update the blog
                        blog.thumbnail = uploadDetails.secure_url;
                }

                // save 
                await blog.save();

                // return successful response with new blog
                return res.status(200).json({
                        success:true,
                        message:"Blog updated successfully",
                        data:blog,
                })
                
        } catch(error){

                // log the error
                console.log('Error in editing blog : ', error);

                // unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in editing blog.',
                        error:error.message,
                })

        }

}