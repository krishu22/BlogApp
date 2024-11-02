// models
const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");

// modules 
const otpGenerator = require("otp-generator"); 
const bcrypt = require("bcrypt"); // hash passwords securely
const jwt = require("jsonwebtoken");

// function to send email
const mailSender = require("../utils/mailSender");

// template of mail to update password
const {passwordUpdated} = require("../mail/templates/passwordUpdate");

// to include environment variables
require("dotenv").config();

// send otp for email verification
exports.sendOTP = async (req,res) => {

        try{
 
                // fetch email from req body
                const {email} = req.body; 

                // check if user already exists
                const checkUserPresent = await User.findOne({email});

                // if yes, return a response
                if (checkUserPresent){
                        // unauthorized status code with error message
                        return res.status(401).json({
                                success:false,
                                message:"User already registered"
                        }) 
                }

                // otherwise, generate otp
                var otp = otpGenerator.generate(6,{
                        upperCaseAlphabets:false,
                        lowerCaseAlphabets:false,
                        specialChars:false,
                });
                console.log("OTP generated : ",otp);

                // check if otp is unique or not
                const result = await OTP.findOne({otp:otp});
                console.log("Result : ", result)
                while(result){
                        otp = otpGenerator(6,{
                                lowerCaseAlphabets:false,
                                upperCaseAlphabets:false,
                                specialChars:false,
                        });
                        result = await OTP.findOne({otp:otp});
                }

                // create an entry for otp
                const otpPayload = {email,otp};
                const otpBody = await OTP.create(otpPayload);
                console.log("OTP body : ", otpBody);

                // successful
                return res.status(200).json({
                        success:true,
                        message:"OTP sent successfully",
                        otp,
                });

        } catch(error){

                console.log("Error in email verification : ", error.message);
                return res.status(500).json({
                        success:false,
                        error:error.message,
                })

        }

}

// signup controller for registering users
exports.signUp = async (req,res) => {

        try{

                // fetch data from req body (destructure fields from the req body)
                const {
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword,
                        accountType,
                        contactNumber,
                        otp
                } = req.body;

                // validation
                if (!firstName || !lastName || !email || !password || !confirmPassword){
                        return res.status(403).json({
                                success:false,
                                message:"All fields are required",
                        });
                }

                // match the two passwords
                if (password !== confirmPassword){
                        return res.status(400).json({
                                success:false,
                                message:"Passwords do not match, please try again."
                        });
                }

                // check if user already exists or not
                const existingUser = await User.findOne({email});
                if (existingUser){
                        return res.status(400).json({
                                success:false,
                                message:"User is already registered. Please sign in to continue.",
                        });
                }

                // find most recent otp stored for the user
                const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
                console.log("recent otp : ",recentOtp);

                // validate the otp
                if (recentOtp.length === 0){
                        // otp not found for the email
                        return res.status(400).json({
                                success:false,
                                message:"OTP not found for the email",
                        });
                } else if (otp !== recentOtp[0].otp){
                        // invalid otp
                        return res.status(400).json({
                                success:false,
                                message:"Invalid OTP",
                        });
                }

                // hash the password
                const hashedPassword = await bcrypt.hash(password,10);

                // create the user
                let approved = "";
                accountType === "Instructor"? (approved = false) : (approved = true)

                // create the additional profile for the user
                const profileDetails = await Profile.create({
                        gender:null,
                        dateOfBirth:null,
                        about:null,
                        contactNumber:null
                });

                // create the user
                const user = await User.create({
                        firstName,
                        lastName,
                        email,
                        contactNumber,
                        password:hashedPassword,
                        approved:approved,
                        accountType:accountType,
                        additionalDetails:profileDetails._id,
                        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
                })

                // return response
                return res.status(200).json({
                        success:true,
                        message:"User registered successfully",
                        user,
                });

        } catch(error){

                console.log("error in registering the user : ",error);
                return res.status(500).json({
                        success:false,
                        message:"User cannot be registered. Please try again.",
                })

        }

}

// login controller for authenticating users
exports.login = async (req,res) => {

        try{

                // get data from req body
                const {email,password} = req.body;

                // validation of data
                if (!email || !password){
                        return res.status(400).json({
                                success:false,
                                message:"All fields are required."
                        });
                }

                // check if user exists or not
                const user = await User.findOne({email}).populate("additionalDetails");

                // if user not found
                if (!user){
                        return res.status(401).json({
                                success:false,
                                message:"User is not registered, please signup first.",
                        });
                }

                // generate jwt, after comparing password
                if (await bcrypt.compare(password, user.password)){
                        const payload = {
                                email: user.email,
                                id: user._id,
                                role: user.role,
                                accountType: user.accountType,
                        };
                        const token = jwt.sign(payload, process.env.JWT_SECRET, {
                                expiresIn:"2h",
                        });
                        /* or
                        const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);*/ 

                        // save token to user document in database
                        user.token = token;
                        user.password = undefined; // data me show nahi hota bass

                        // set cookie for token 
                        const options = {
                                expires: new Date(Date.now() + 3*24*3600*1000),
                                httpOnly:true,
                        }

                        // return success response
                        res.cookie("token",token,options).status(200).json({
                                success:true,
                                token,
                                user,
                                message:"Logged in successfully",
                        });

                } else{

                        return res.status(401).json({

                                success:false,
                                message:"Password is incorrect"

                        })

                }

        } catch(error) {
                console.log("error in signing in : ",error);
                return res.status(500).json({
                        success:false,
                        message:"Login failed. Please try again.",
                })

        }

}

// change password
exports.changePassword = async (req,res) => {

        try{

                // get user data from req body
                const {email} = req.body; 

                // get oldpassword, newpassword, confirmnewpassword from req body
                const {oldPassword, newPassword, confirmNewPassword} = req.body;

                // fetch user details
                const userDetails = await User.findOne({email});

                // validation of old password
                const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
                if (!isPasswordMatch){
                        // if old password doesnt match, return 401 unauthorized error
                        return res.status(401).json({
                                success:false,
                                message:"The password is incorrect"
                        })
                }

                // match new password and confirm new password
                if (newPassword !== confirmNewPassword){
                        // 400 (bad req error)
                        return res.status(400).json({
                                success:false,
                                message:"Password and confirm password do not match",
                        });
                }

                // update password in db
                const encryptedPassword = await bcrypt.hash(newPassword,10);
                const updatedUserDetails = await User.findByIdAndUpdate(userDetails._id, {password: encryptedPassword}, {new:true});

                // send mail - password updated
                try{
                        const emailResponse = await mailSender(
                                updatedUserDetails.email,
                                passwordUpdated(
                                        updatedUserDetails.email,
                                        `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetailslastName}`
                                )
                        );
                        console.log("Email sent successfully:", emailResponse.response);
                } catch (error){
                        // If there's an error sending the email, log the error and return a 500 (Internal Server) error
                        console.error("Error occurred while sending email:", error);
                        return res.status(500).json({
                                success: false,
                                message: "Error occurred while sending email",
                                error: error.message,
                        });
                }

                // return response
                return res.status(200).json({
                        success:true,
                        message:"Password updated successfully."
                })

        } catch(error) {

                // 500 (internal server error) 
                console.error("Error occured while updating password : ", error);
                return res.status(500).json({
                        success:false,
                        message:'Error occured while updating password',
                        error: error.message,
                });

        }

};