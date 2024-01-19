const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadToCloudinary} = require('../utils/ImageUploader');
require('dotenv').config();

exports.createSubSection = async(req,res) => {
    try{
        const {sectionId,title, description} = req.body;
        const video = req.files.video;
        if(!title || !description || !sectionId || !video){
            return res.status(404).json({
                success:false,
                message:'All fields are required'
            })
        }
        const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME);
        const subSectionDetails = await SubSection.create({
            title:title, 
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {$push:{subSection:subSectionDetails._id}}, {new:true}).populate('subSection').exec();
        return res.status(200).json({
            success:true,
            data: updatedSection
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create subSection',
            error:error.message
        })
    }
}

//updateSubsection and deleteSubSection
exports.updateSubSection = async(req,res) => {
    try{
        const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

      const updatedSection = await Section.findById(sectionId).populate("subSection").exec();
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection
      })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to update subSection',
            error:error.message
        })
    }
}

exports.deleteSubSection = async(req,res) => {
    try{
        const {subSectionId, sectionId} = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
          )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:'Subsection not found'
            })
        }
        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();
        return res.status(200).json({
            success:true,
            message:"SubSection deleted Successfully",
            data: updatedSection
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete subSection',
            error:error.message
        })
    }
}