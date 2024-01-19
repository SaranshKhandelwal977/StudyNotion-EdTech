const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*5
    },
    otp:{
        type:String,
        required:true
    }
})

// function to send email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,'Verification Email from StudyNotion', emailTemplate(otp));
        console.log('Email sent successfully ', mailResponse);
    }
    catch(error){
        console.log('Error occured while sending mail ', err);
        throw error;
    }
}

otpSchema.pre('save', async function(next){
    console.log("New document saved to database");
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})

module.exports = mongoose.model("Otp", otpSchema);