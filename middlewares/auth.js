/* 

-> next() => if everything is okay and the func is working fine, it moves to the next middleware
 
-> Authentication: The auth middleware verifies that a valid JWT token is present and decodes it to attach user information to the request.

-> Authorization: The isStudent, isInstructor, and isAdmin middleware functions check the user's account type to ensure they have the appropriate permissions to access specific routes.

-> "Authenticate the user" refers to the process of verifying the identity of the user making the request. In web applications, this typically involves checking that the user has provided valid credentials, such as a username and password, or a token, that confirms their identity.

*/


// modules
const jwt = require("jsonwebtoken"); // creating and verifying jwts

// env variables
require("dotenv").config(); // load environment variables from .env file


// models
const User = require("../models/User");

// authenticates the user
// if token is present, it verifies the token using the secret from env variables
// if token is valid, the decoded information is attached to the req.user object.
exports.auth = async (req,res,next) => {

        try{

                // extract token
                const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

                // if token is missing, return response
                if (!token){
                        return res.status(401).json({
                                success:false,
                                message:"Token is missing",
                        });
                }

                // verify the token
                try{
                        const decode = await jwt.verify(token, process.env.JWT_SECRET);
                        console.log("auth decode : ", decode);
                        req.user = decode; // so that req.user.id = userId
                } catch(error){
                        // verification issue
                        return res.status(401).json({
                                success:false,
                                message:"Token is invalid",
                        });
                }

                next();

        } catch(error) {

                return res.status(500).json({
                        success:false,
                        message:"Something went wrong while validating the token",
                });

        }

}

// isAdmin
// checks if authenticated user has a admin account type. if not, 401 status. if yes, next middleware
exports.isAdmin = async (req,res,next) => {

        try{

                if (req.user.accountType !== "Admin"){
                        return res.status(401).json({
                                success:false,
                                message:"This is a protected route for Admins only."
                        });
                }

                next();

        } catch(error) {

                return res.status(500).json({
                        success:false,
                        message:"User role cannot be verified. Please try again. ",
                });         

        }

}

// isCreator
exports.isCreator = async (req,res,next) => {

        try{

                if (req.user.accountType !== "Creator"){
                        return res.status(401).json({
                                success:false,
                                message:"This is a protected route for Creators only."
                        });
                }

                next();

        } catch(error) {

                return res.status(500).json({
                        success:false,
                        message:"User role cannot be verified. Please try again. ",
                });         

        }

}

// isReader
exports.isReader = async (req,res,next) => {

        try{

                if (req.user.accountType !== "Reader"){
                        return res.status(401).json({
                                success:false,
                                message:"This is a protected route for Readers only."
                        });
                }

                next();

        } catch(error) {

                return res.status(500).json({
                        success:false,
                        message:"User role cannot be verified. Please try again. ",
                });       

        }
        
}

