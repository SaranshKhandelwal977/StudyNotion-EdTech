import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"

const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [videobarActive, setVideobarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId, subSectionId} = useParams();
    const location = useLocation();
    const {courseSectionData,courseEntireData,completedLectures,totalNoOfLectures} = useSelector((state) => state.viewCourse);

    useEffect(() => {
        const setActiveFlags = () => {
            if(!courseSectionData.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((data) => data._id === subSectionId);
            const activeSubsectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
            //set current section
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
            //set current subSection
            setVideobarActive(activeSubsectionId)
        }
        setActiveFlags();
    },[courseSectionData,courseEntireData, location.pathname])

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                <div className="flex w-full items-center justify-between ">
                    <div onClick={() => {navigate(`/dashboard/enrolled-courses`)}}
                    className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                    title="back"
                    >
                        <IoIosArrowBack size={30} />
                    </div>
                    <div><IconBtn text={"Add review"} customClasses="ml-auto" onclick={() => setReviewModal(true)}/></div>
                </div>
                <div className="flex flex-col">
                    <p>{courseEntireData.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500">{completedLectures?.length} / {totalNoOfLectures}</p>
                </div>
            </div>
            <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((section,index) => (
                        <div key={index} onClick={() => setActiveStatus(section?._id)} 
                            className="mt-2 cursor-pointer text-sm text-richblack-5"
                        >
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">{section?.sectionName}</div>
                                <div className="flex items-center gap-3">
                                    <span className={`${activeStatus === section?.sectionName ? "rotate-0" : "rotate-180"} transition-all duration-500`}>
                                    <BsChevronDown />
                                    </span>
                                </div>
                            </div>
                            <div>
                                {
                                    activeStatus === section?._id && (
                                        <div className="transition-[height] duration-500 ease-in-out">
                                            {
                                                section?.subSection.map((subSection,index) => (
                                                    <div className={`flex gap-5 p-5 ${videobarActive === subSection?._id ? "bg-yellow-200 font-semibold text-richblack-800" : "hover:bg-richblack-900"}`} key={index} 
                                                    onClick={() => {
                                                        navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subSection?._id}`)  
                                                        setVideobarActive(subSection?._id)
                                                    }}
                                                    >
                                                        <input type='checkbox' checked={completedLectures.includes(subSection._id)} onChange={() => {}}/>
                                                        {subSection.title}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    
    </>
  )
}

export default VideoDetailsSidebar