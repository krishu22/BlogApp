const mongoose = require('mongoose'); // library that helps us work with a MongoDB database easily
const nodemailer = require("nodemailer");

// function to send emails
const mailSender = require("../utils/mailSender");

// email verification body (template)
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate"); // contains the layout and structure of the verification email
 
const otpSchema = new mongoose.Schema({

        email:{
                type:String,
        },

        otp:{
                type:String,
                required:true,
        },

        createdAt:{ 
                type:Date,
                default:Date.now(),
                expires:5*60, // automatically delete the entry after 5 minutes (300 seconds)
        }
        
});

// function to send emails
async function sendVerificationEmail(email,otp){

        

        try{

                const mailResponse = await mailSender(email, "Verification email", emailVerificationTemplate(otp));
                console.log("Email sent successfully : ", mailResponse.response);

        } catch(error){

                console.log("Error occured while sending email.");
                throw error;

        }
}

// db mein save krne se pehle mail send krni hai ; pre middleware
// middleware function that runs before a new document (data entry) is saved to the database.
otpSchema.pre("save", async function(next){

        console.log("New doc saved to database.");
        // send an email only when a new doc is created
        if (this.isNew){ // It checks if the document is new 
                await sendVerificationEmail(this.email, this.otp); // 'this' represents the current otp document in the database
        }
        
        next(); // move on to the next step after the email is sent.

})

 
module.exports = mongoose.model('OTP', otpSchema);


/* 
why do we have to check if the document is new ?

In this code, checking if the document is new is crucial because the `pre("save")` middleware is triggered for all save operations, including updates to existing documents. 

Here's why checking if the document is new is important:

1. **Avoid Sending Duplicate Emails**:
   - If you don’t check if the document is new, the `sendVerificationEmail` function could be called every time the document is saved, including updates. For example, if you update an existing OTP record, you don’t want to send a new verification email each time the record is updated. 

2. **Only Send Email for Initial Creation**:
   - The goal is to send the verification email only when a new OTP document is created, not when an existing document is updated. By checking `this.isNew`, you ensure that the email is sent only during the creation of a new OTP record.

3. **Efficiency and Relevance**:
   - Sending emails unnecessarily can lead to spam or user confusion. You only want to send the email when it is relevant, which is typically during the initial creation of the OTP document.

### Example Scenario

- **Creating a New OTP**: When you create a new OTP (e.g., when a user requests verification), the document is new, and the email is sent to the user.
- **Updating an Existing OTP**: If you update an existing OTP (e.g., when the OTP expires or is refreshed), the email should not be resent. Checking `this.isNew` prevents this.

In summary, the `this.isNew` check ensures that emails are sent only for new records, avoiding unnecessary emails and ensuring proper email handling based on the document's state.
*/