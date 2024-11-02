const mongoose = require("mongoose"); // odm(object data modelling) lib for mongodb and nodejs

require("dotenv").config(); // dotenv module loads .env variables into process.env  ; keep sensitive info out of source code

exports.connect = () => { // a function named connect is been exported ; can be used in other files
        
        mongoose.connect(process.env.MONGODB_URL, { // mongoose.connect() func establishes a connection to the mongodb database; takes 2 arguments : database url and an options object to avoid deprecation warnings
                useNewUrlParser : true,
                useUnifiedTopology : true,
        })
        .then(() => console.log("DB connected successfully")) // if connection is successful
        .catch((error) => {
                console.log("DB connection failed");
                console.error(error); // logs the actual error to the console for debugging 
                process.exit(1); // a method of process object in nodejs ; provides info and control over the current nodejs process ; 0 -> successful termination of code (w/o errors) ; 1 -> an error caused it to exit
        })

}