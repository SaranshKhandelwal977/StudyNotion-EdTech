const User = require('../models/User');
const mailSender = require('../utils/MailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//resetpassword token --> mailsend krne ka kaam
exports.resetPasswordToken = async(req,res) => {
    try{
        //email from body
        const email = req.body.email;
        //email exisits in db or not
        const findUser = await User.findOne({email:email});
        if(!findUser){
            return res.status(400).json({
                success:false,
                message:`This Email: ${email} is not Registered With Us Enter a Valid Email `
            })
        }
        //generate token
        const token = crypto.randomBytes(20).toString("hex");
        //update user for adding token and expiration time  
        const updatedDetails = await User.findOneAndUpdate({email:email},{token:token, resetPasswordExpires: Date.now() + 3600000},{new:true});
        //generate fronend link
        const url = `https://study-notion-ed-tech-lovat.vercel.app/update-password/${token}`;
        //send mail
        await mailSender(email,'Password reset link',`Your Link for email verification is ${url}. Please click this url to reset your password.`);
        //return response
        res.status(200).json({
            success:true,
            message:'Email Sent Successfully, Please Check Your Email to Continue Further'
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'Something went wrong, please try again'
        })
    }

}
//resetpassword -->in DB
exports.resetPassword = async(req,res) => {
    try{
        //token ko frontend ne dala body mei
        const {password, confirmPassword,token} = req.body;
        if(password !== confirmPassword){
            res.status(400).json({
                success:false,
                message:"Password and Confirm Password Does not Match"
            })
        }
        //find user from db using token
        const user = await User.findOne({token:token});
        if(!user){
            return res.status(400).json({
                success:false,
                message:'Token is invalid'
            })
        }
        if(!(user.resetPasswordExpires > Date.now())){
            return res.status(400).json({
                success:false,
                message:'Token is expired, please regenerate token'
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});

        res.status(200).json({
            success:true,
            message:'Password reset successfully '
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:'Something went wrong '
        })
    }
}

 
