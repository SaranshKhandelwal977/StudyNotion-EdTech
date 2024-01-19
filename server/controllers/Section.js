const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

exports.createSection = async(req,res) => {
    try{
        const {sectionName, courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing required properties'
            })
        }
        const newSection = await Section.create({sectionName});
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true})
                                            .populate({
                                                path: "courseContent",
                                                populate: { path: "subSection",},
                                            }).exec();
        return res.status(200).json({
            success:true,
            message:"Section created Successfully",
            updatedCourseDetails
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create section',
            error:error.message
        })
    }
}

exports.updateSection = async(req,res) => {
    try{
        const {sectionName,courseId, sectionId} = req.body;
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        const course = await Course.findById(courseId).populate({path: "courseContent", populate:{path: "subSection"}}).exec();
        return res.status(200).json({
            success:true,
            message:section,
            data:course
        })

    }
    catch(error){
        console.error("Error updating section:", error)
        return res.status(500).json({
            success:false,
            message:'Failed to update section',
            error:error.message
        })
    }
}

exports.deleteSection = async(req,res) => {
    try{
        const {sectionId,courseId} = req.body;
        await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(400).json({
                success:false,
                message:'Section not found'
            })
        }
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        await Section.findByIdAndDelete(sectionId);

        const course = await Course.findById(courseId).populate({path: "courseContent", populate:{path: "subSection"}}).exec();
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully",
            data: course
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete section',
            error:error.message
        })
    }
}