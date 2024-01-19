const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

exports.createRating = async(req,res) => {
    try{
        //get userid
        const userId = req.user.id;
        //fetch data from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId, studentsEnrolled:{$elemMatch: {$eq: userId}}});
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course'
            })
        }
        //user already review the course
        const alreadyReviewed = await RatingAndReview.findOne({user:userId, course:courseId});
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user'
            })
        }
        //create the rating and review
        const ratingReview = await RatingAndReview.create({rating,review,course:courseId, user:userId});
        //update course model course model
        await Course.findByIdAndUpdate(courseId, {$push:{ratingAndReviews: ratingReview}});
        await courseDetails.save()
        return res.status(200).json({
            success: true,
            message: 'Rating and review are created successfully',
            ratingReview
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

exports.getAverageRating = async(req,res) => {
    try{
        const courseId = req.body.courseId;
        const result = await RatingAndReview.aggregate([
            { //ek aesi entry find kro jisme course mei courseId ho
                $match:{course: new mongoose.Types.ObjectId(courseId),}
            },
            {
                $group:{
                    _id:null, //mtlb jitni bhi entries aayi thi unko ek hi group mei wrap kr diya
                    averageRating: {$avg: '$rating'},
                } 
            }
        ]) 
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating:result[0].averageRating
            })
        }
        return res.status(200).json({
            success: true,
            message:'Avegage rating is 0, no ratings are given till now',
            averageRating:0
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating for the course",
            error: error.message,
        })
    }
}

exports.getAllRatings = async(req,res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                                .sort({rating:'desc'})
                                                .populate({path:'user',select:"firstName lastName email image"})
                                                .populate({path:'course', select:'courseName'})
                                                .exec();
        return res.status(200).json({
            success: true,
            data: allReviews
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating and review for the course",
            error:error.message
        })
    }
}