// import models
const Category = require("../models/Category");
const Blog = require("../models/Blog");
const User = require("../models/User")

// create a category 
exports.createCategory = async(req,res) => {

        try{

                // fetch data 
                const {userId} = req.body;
                const {name,description} = req.body;

                // validation
                if (!userId || !name || !description){
                        return res.status(400).json({
                                success:false,
                                message:"All fields are required",
                        })
                }

                // find if user exists or not
                const userDetails = await User.findById(userId);
                if (!userDetails){
                        return res.status(400).json({
                                success:false,
                                message:"User not found",
                        })
                }

                // create entry in db
                const category = await Category.create({
                        name,
                        description,
                        creator:userDetails._id,
                })

                // return successful response
                return res.status(500).json({
                        success:true,
                        message:"Category created successfully."
                })
                
        } catch(error){

                // log the error
                console.log('Error in creating category : ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in creating category',
                        error:error.message,
                })

        }

}

// get a category
exports.getCategoryDetails = async(req,res) => {

        try{

                // get category id
                const {categoryId} = req.params;

                // check if id exists or not and populate
                const categoryDetails = await Category.findById(categoryId)
                //.populate("blogs").exec(); (not working ; error ; check)
                if (!categoryDetails){
                        return res.status(404).json({
                                success:false,
                                message:"Category not found"
                        })
                }

                // return successful response with category data
                return res.status(200).json({
                        success:true,
                        message:"Category details fetched successfully",
                        data:categoryDetails,
                })
                
        } catch(error){

                // log the error
                console.log('Error in fetching category details : ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:"Error in fetching category details",
                        error:error.message,
                })

        }

}

// show all categories
exports.showAllCategories = async(req,res) => {

        try{

                // fetch all categories
                const allCategories = await Category.find({}, {
                        name:true,
                        description:true,
                        creator:true,
                })
                .populate("creator")
                .exec();

                // return successful response with data
                return res.status(200).json({
                        message:"All categories returned successfully",
                        success:true,
                        data:allCategories,
                })
                
        } catch(error){

                // log the error
                console.log('Error in showing all categories : ', error);

                // return unsuccessful response
                return res.status(500).json({
                        success:false,
                        message:'Error in showing all categories',
                        error:error.message,
                })
        }

}