const mongoose = require('mongoose');
 
const blogSchema = new mongoose.Schema({

        creator:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
        },

        thumbnail:{
                type:String,
                trim:true,
        },

        title:{
                type:String,
                trim:true,
                required:true,
        },

        tags:{
                type:[String],
        },

        category:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Category",
                required:true,
        }],

        content:{
                type:String,
                required:true,
                trim:true,
        },

        ratings:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Rating",
        }],

        likes:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
        }],

        comments:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment",
        }]
        
},{timestamps:true});
 
module.exports = mongoose.model('Blog', blogSchema);