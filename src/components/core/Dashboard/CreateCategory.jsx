import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { createCategory } from '../../../services/operations/courseDetailsAPI';

const CreateCategory = () => {
    const {token} = useSelector((state) => state.auth);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState:{errors,isSubmitSuccessful}
    } = useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                name:"",
                description:"",
            })
        }
    },[isSubmitSuccessful,reset])

    const submitHandler = async (data) => {
        setLoading(true);
        try{
            dispatch(createCategory(data, token));  
        }
        catch(error){

        }
        setLoading(false);
    }
    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

  return (
    <div>
        <form onSubmit={handleSubmit(submitHandler)} className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
            <div className="flex flex-col space-y-2">
                <label htmlFor='name' className="text-sm text-richblack-5">Category Name<sup className="text-pink-200">*</sup></label>
                <input
                    id='name'
                    placeholder='Enter Category Name'
                    {...register("name", {required:true})}
                    className="form-style w-full"
                />
                {
                    errors.name && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">Category Name is required</span>
                    )
                }
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor='description' className="text-sm text-richblack-5">Category Short Description</label>
                <textarea
                    id='description'
                    placeholder='Enter Description'
                    {...register("description")}
                    className='form-style resize-x-none min-h-[130px] w-full'
                />
                {
                    errors.description && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">Category Short Description is required</span>
                    )
                }
            </div>
            <button
                type="submit"
                className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
            >
                Save
            </button>

        </form>
    </div>
  )
}

export default CreateCategory