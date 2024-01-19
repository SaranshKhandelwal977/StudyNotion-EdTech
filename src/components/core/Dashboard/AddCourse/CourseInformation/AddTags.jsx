import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { MdClose } from "react-icons/md"

const AddTags = ({label,name,register,errors,placeholder,setValue,getValues}) => {

    const [tag, setTag] = useState("");
    const [tagList, setTagList] = useState([]);
    const { editCourse, course } = useSelector((state) => state.course)
    
    const handleRemoveTag = (index) => {
        const updatedTagList = [...tagList];
        updatedTagList.splice(index,1);
        setTagList(updatedTagList)
    }

    const handleKeyDown = (event) => {
        if(event.key === 'Enter' || event.key === "," ){
            event.preventDefault()
            if(tag && !tagList.includes(tag)){
                setTagList([...tagList, tag]);
                event.target.value = "";
            }
            setTag("");
        }
    }

    useEffect(() => {
        if (editCourse) {
            setTagList(course?.tag)
        }
        register(name, {required:true, validate: (value) => value.length > 0 })
    },[])

    useEffect(() => {
        setValue(name, tagList);
    },[tagList])

  return (
    <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor={name}>{label}<sup className="text-pink-200">*</sup></label>
        <div className="flex w-full flex-wrap gap-y-2">
            {
                tagList.map((tag, index) => (
                    <div key={index} className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5">
                        {tag}
                        <button type='button' onClick={() => handleRemoveTag(index)} className="ml-2 focus:outline-none">
                            <MdClose className="text-sm" /> 
                        </button>
                    </div>
                )) 
            }              
            <input
                type='text'
                id={name}
                name={name}
                onChange={(e) => setTag(e.target.value)}
                placeholder={placeholder}
                className="form-style w-full"
                onKeyDown={handleKeyDown}
            />
        </div>
        
        {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                {label} is required
            </span>
        )}
    </div>
  )
}

export default AddTags