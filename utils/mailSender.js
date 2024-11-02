// import the library to send emails
const nodemailer = require("nodemailer");

// using environment variables in this file
require("dotenv").config();

// async function to send emails ; has a try-catch block to to handle errors while sending emails
const mailSender = async (email,title,body) => {
        try{

                // create a transporter object
                let transporter = nodemailer.createTransport({
                        host:process.env.MAIL_HOST,
                        auth:{
                                user:process.env.MAIL_USER,
                                pass:process.env.MAIL_PASS,
                        }
                })

                // mail that has to be sent
                let info = await transporter.sendMail({
                        from : "Blogs App by Krishuu",
                        to : `${email}`,
                        subject : `${title}`,
                        html : `${body}`,
                })

                // print the mail content
                console.log("Info : ",info);

                // return mail that has to be sent
                return info;

        } catch(error){

                // log the error
                console.log("Error : ", error.message);

        }

}

module.exports = mailSender;