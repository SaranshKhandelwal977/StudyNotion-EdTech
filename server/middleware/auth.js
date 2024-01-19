const jwt = require('jsonwebtoken');
const User = require('../models/User')
require("dotenv").config();

//auth
exports.auth = async(req,res,next) => {
    try{
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '') || req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token not found'
            })
        }
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch(error){
            return res.status(401).json({
                success:false,
                message:'Token is invalid'
            })
        }
        next()
    } catch(error){
        res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token'
        })
    }
}
//isStudent
exports.isStudent = async(req,res,next) => {
    try{
        const userDetails = await User.findOne({ email: req.user.email });
        if(userDetails.accountType !== 'Student'){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for students only'
            })
        }
        next();
    } catch(err){
        return res.status(401).json({
            success:false,
            message:"User Role Can't be Verified"
        })
    }
}

//isAdmin

exports.isAdmin = async(req,res,next) => {
    const userDetails = await User.findOne({ email: req.user.email });
    try{
        if(userDetails.accountType !== 'Admin'){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admins only'
            })
        }
        next();
    } catch(err){
        return res.status(401).json({
            success:false,
            message:"User Role Can't be Verified"
        })
    }
}

//isInstructor

exports.isInstructor = async(req,res,next) => {
    const userDetails = await User.findOne({ email: req.user.email });
    try{
        if(userDetails.accountType !== 'Instructor'){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for instructors only'
            })
        }
        next();
    } catch(err){
        return res.status(401).json({
            success:false,
            message:"User Role Can't be Verified"
        })
    }
}