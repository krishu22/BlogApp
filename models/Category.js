const mongoose = require('mongoose');
 
const categorySchema = new mongoose.Schema({

        name:{
                type:String,
                trim:true,
                required:true,
        },

        description:{
                type:String,
                trim:true,
                required:true, 
        },

        creator:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
        },

        blogs:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Blog",
        }],
        
});
 
module.exports = mongoose.model('Category', categorySchema);