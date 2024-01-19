const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadToCloudinary} = require('../utils/ImageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');
require('dotenv').config();

exports.updateProfile = async(req,res) => {
    try{
        const{firstName = "", lastName = "", dateOfBirth = "", about = "", contactNumber = "", gender = ""} = req.body;
        const userId = req.user.id;
        let userDetails = await User.findById(userId);
        const profileDetails = await Profile.findById(userDetails.additionalDetails);

        const user = await User.findByIdAndUpdate(userId, {firstName, lastName})
        await user.save()

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();
        const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:'Profile details updated successfully',
            updatedUserDetails
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to update profile',
            error:error.message
        })
    }
}

exports.deleteAccount = async(req,res) => {
    try{
        const userId = req.user.id;
        const userDetails = await User.findById({_id:userId});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not present'
            })
        }
        await Profile.findByIdAndDelete({_id:new mongoose.Types.ObjectId(userDetails.additionalDetails)});
        for (const courseId of userDetails.courses) {
            await Course.findByIdAndUpdate(courseId,{ $pull: { studentsEnrolled: id } },{ new: true })
        }
        await User.findByIdAndDelete({_id:userId});
        await CourseProgress.deleteMany({ userId: userId })
        return res.status(200).json({
            success:true,
            message:'Account deleted successfully',
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete account',
            error:error.message
        })
    }
}

exports.getAllUserDetails = async(req,res) => {
    try{
        const userId = req.user.id;
        const userDetails = await User.findById(userId).populate('additionalDetails').exec();
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not present'
            })
        }
        return res.status(200).json({
            success:true,
            message:'user details found successfully',
            data: userDetails
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to fetch user details',
            error:error.message
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadToCloudinary(displayPicture,process.env.FOLDER_NAME,1000,1000)
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate({ _id: userId },{ image: image.secure_url },{ new: true })
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({_id: userId,}).populate({
            path:"courses", 
            populate: {
                path: "courseContent",
                populate:{path: "subSection"}
            }
        })
        .exec();
        
        userDetails = userDetails.toObject()
	    var SubsectionLength = 0
	    for (var i = 0; i < userDetails.courses.length; i++) {
		    let totalDurationInSeconds = 0
		    SubsectionLength = 0
		    for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += 
                    userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
		    }
		    let courseProgressCount = await CourseProgress.findOne({courseID: userDetails.courses[i]._id,userId: userId})
		    courseProgressCount = courseProgressCount?.completedVideos.length
		    if (SubsectionLength === 0) {
		        userDetails.courses[i].progressPercentage = 100
		    } else {
		        // To make it up to 2 decimal point
		        const multiplier = Math.pow(10, 2)
		        userDetails.courses[i].progressPercentage = Math.round((courseProgressCount/ SubsectionLength) * 100 * multiplier) / multiplier
		    }   
	    }
  
	    if (!userDetails) {
		    return res.status(400).json({
		        success: false,
		        message: `Could not find user with id: ${userDetails}`,
		    })
	    }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


exports.instructorDashboard = async(req,res) => {
    try{
        const courseDetails = await Course.find({instructor: req.user.id});
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalIncome = totalStudentsEnrolled * course.price;
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalIncome
            }
            return courseDataWithStats;
        })
        res.status(200).json({
            success:true,
            courses:courseData
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
