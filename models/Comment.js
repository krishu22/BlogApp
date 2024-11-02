const mongoose = require('mongoose');
 
const commentSchema = new mongoose.Schema({

        creator:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
        },

        blog:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Blog",
                required:true,
        },
 
        content:{ 
                type:String,
                required:true,
                trim:true,
        },

        createdAt:{
                type:Date,
                default:Date.now(),
                required:true,
        },
        
}, {timestamps:true});
 
module.exports = mongoose.model('Comment', commentSchema);