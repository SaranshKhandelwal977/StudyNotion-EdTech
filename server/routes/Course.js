// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers
const {createCourse,editCourse,getFullCourseDetails,getInstructorCourses,deleteCourse,showAllCourses,getCourseDetails} = require("../controllers/Course")

// Categories Controllers Import
const {showAllCategories,createCategory,categoryPageDetails} = require("../controllers/Category")

// Sections Controllers Import
const {createSection,updateSection,deleteSection} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/SubSection")

// Rating Controllers Import
const {createRating,getAverageRating,getAllRatings} = require("../controllers/RatingAndReview")

// Importing Middlewares
const { updateCourseProgess } = require("../controllers/CourseProgress")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.get("/getAllCourses", showAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/updateCourseProgress",auth,isStudent,updateCourseProgess)
router.delete("/deleteCourse", deleteCourse)
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatings)

module.exports = router;