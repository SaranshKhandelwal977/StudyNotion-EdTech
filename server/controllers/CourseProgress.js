const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgess = async (req,res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id
    try{
        //check if subsection is valid or not
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({
                error:"Invalid subsection"
            })
        }

        let courseProgress = await CourseProgress.findOne({courseID: courseId, userId:userId});
        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course progress does not exist"
            })
        }
        else{
            //check for re-completing video
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error:"SubSection already completed"
                })
            }
            courseProgress.completedVideos.push(subSectionId)
        }
        await courseProgress.save();
        return res.status(200).json({
            success:true,
            message: "Course progress updated",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}