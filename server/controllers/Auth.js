const bcrypt = require('bcrypt');
const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/MailSender');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require('dotenv').config();

//sendOTP
exports.sendOtp = async (req,res) => {
    try{
        const{email} = req.body;
        const checkUserExist = await User.findOne({email});
        if(checkUserExist){
            return res.status(401).json({
                success:false,
                message:'User is Already Registered'
            })
        }
        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        //check unique otp or not
        const result = await Otp.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
        }
        const otpPayload = {email, otp};
        //entry in db for otp
        const otpBody = await Otp.create(otpPayload);
        console.log("otp-body: ",otpBody);
        res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            otp
        })
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

//signup
exports.signup = async(req,res) => {
    try{
        //data fetch from body
        const{email,firstName,lastName,password,confirmPassword,otp,accountType,contactNumber} = req.body;
        //validation
        if(!email || !firstName || !lastName || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            })
        }
        //match both passwords
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and Confirm Password value does not match, please try again'
            })
        }
        //check already exist
        const checkUserExist = await User.findOne({email});
        if(checkUserExist){
            return res.status(400).json({
                success:false,
                message:'User already exist, please sign in to continue'
            })
        }

        //find most recent otp
        const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
        //validate otp
        if (response.length === 0){
            return res.status(400).json({
                success:false,
                message:'OTP is not valid'
            });
        } 
        else if(otp !== response[0].otp){
            return res.status(400).json({
                success:false,
                message:'OTP is incorrect'
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
        const profileDetails = await Profile.create({
            gender:null,
            datOfBirth:null,
            about:null,
            contactNumber:null
        }) 

        //create entry in db
        const user = await User.create({
            email,
            firstName,
            lastName,
            contactNumber,
            password:hashedPassword, 
            accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image: ""
        })
        //send res
        return res.status(200).json({
            success:true,
            message:'User is registered successfully',
            user
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again'
        })
    }
}

//login
exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return req.status(400).json({
                success:false,
                message:'Please Fill up All the Required Fields'
            })
        }
        const user = await User.findOne({email}).populate('additionalDetails');
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not Registered with Us Please SignUp to Continue'
            })
        }
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'24h'});
            user.token = token;
            user.password = undefined;
            const options =  {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie('token',token,options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully'
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:`Login Failure Please Try Again`
        })
    }
}

//change password
exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id)
        const { oldPassword, newPassword } = req.body
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        if (!isPasswordMatch) {
            return res
            .status(401)
            .json({ success: false, message: "The password is incorrect" })
        }
    
        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )
    
        // Send notification email
        try {
            const emailResponse = await mailSender(
            updatedUserDetails.email,
            "Password for your account has been updated",
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
            )
            console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
            })
        }
    return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
    })
    }
}