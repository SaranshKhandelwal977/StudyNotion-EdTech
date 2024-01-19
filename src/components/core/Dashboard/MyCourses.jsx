import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import IconBtn from '../../common/IconBtn';
import CoursesTable from './InstructorCourses/CoursesTable';
import { VscAdd } from "react-icons/vsc"

const MyCourses = () => {
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [durationArray, setDurationArray] = useState([]);
    useEffect(() => {
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result[0]);
                setDurationArray(result[1]);
            }
        }
        fetchCourses();
    },[])
  return (
    <div>
        <div className="mb-14 flex items-center justify-between">
            <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
            <IconBtn text="Add Course" onclick={() => navigate("/dashboard/add-course")}><VscAdd /></IconBtn>
        </div>
        {
            courses && <CoursesTable courses={courses} setCourses={setCourses} durationArray={durationArray} setDurationArray={setDurationArray}/>
        }
    </div>
  )
}

export default MyCourses