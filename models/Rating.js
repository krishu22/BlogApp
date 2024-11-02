const mongoose = require('mongoose');
 
const ratingSchema = new mongoose.Schema({

        rating:{
                type:Number,
                required:true,
        },

        creator:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true, 
        },

        blog:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Blog",
                required:true,
        }
        
});
 
module.exports = mongoose.model('Rating', ratingSchema); 