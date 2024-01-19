import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiConnector } from '../../../services/apiConnector';
import { contactusEndpoint } from '../../../services/apis';
import CountryCode from "../../../data/countrycode.json"
import toast from 'react-hot-toast';

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register, 
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        try{
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            toast.success("Your message sent successfully")
            console.log("mail response is: ", response);
            setLoading(false);
        }
        catch(error){
            console.log("ERROR MESSAGE - ", error.mesage);
            toast.error(error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:""
            })
        }
    },[isSubmitSuccessful,reset])
  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
        <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor='firstName' className="lable-style">First Name</label>
                <input 
                    type='text'
                    name='firstName'
                    id='firstName'
                    placeholder='Enter First Name'
                    className="form-style"
                    {...register("firstName", {required:true})}
                />
                {
                    errors.firstName && (<span className="-mt-1 text-[12px] text-yellow-100">Please enter your name</span>)
                }
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label className="lable-style" htmlFor='lastName'>Last Name</label>
                <input 
                    type='text'
                    name='lastName'
                    id='lastName'
                    placeholder='Enter Last Name'
                    className='form-style'
                    {...register("lastName", {required:true})}
                />
            </div>
        </div>
        <div className='flex flex-col gap-2'>
            <label className="lable-style" htmlFor='email'>Email address</label>
            <input 
                type='email'
                name='email'
                id='email'
                placeholder='Enter Email address'
                className='form-style'
                {...register("email", {required:true})}
            />
            {
                errors.email && (<span className="-mt-1 text-[12px] text-yellow-100">Please enter Email Address</span>)
            }
        </div>
        <div className='flex flex-col gap-2'>
            <label className="lable-style" htmlFor='phoneNo'>Phone Number</label>
            <div className='flex gap-5'>
                <div className="flex w-[81px] flex-col gap-2">
                    <select type="text" name='dropdown' id='dropdown' className='form-style' {...register("countryCode", {required:true})}>
                        {
                            CountryCode.map((data,index) => {
                                return(
                                    <option key={index} value={data.code}>{data.code} - {data.country}</option>
                                )
                                
                            })
                        }
                    </select>
                </div>
                <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                    <input
                        type='number'
                        name='phoneNo'
                        id='phoneNo'
                        placeholder='01234 56789'
                        className="form-style"
                        {...register("phoneNo", {required:{
                                                    value:true, 
                                                    message:"Please enter phone no"
                                                }, 
                                                maxLength:{value:12, message:"Invalid phone no"}, 
                                                minLength:{value:10, message:"Invalid phone no"}
                                                }
                                    )
                        }
                    />
                </div>
            </div>
            {
                errors.phoneNo && (<span className="-mt-1 text-[12px] text-yellow-100">{errors.phoneNo.message}</span>)
            }
        </div> 
        <div className="flex flex-col gap-2">
            <label className="lable-style" htmlFor='message'>Message</label>
            <textarea 
                name='message'
                id='message'
                cols='30'
                rows='7'
                placeholder='Enter your message here'
                className="form-style"
                {...register("message", {required:true})}
            />
            {
                errors.message && (<span className="-mt-1 text-[12px] text-yellow-100">Please enter your message</span>)
            }
        </div> 
        <button type='submit' disabled={loading} className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] ${!loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"}  disabled:bg-richblack-500 sm:text-[16px] `}>Send message</button> 
    </form>
  )
}

export default ContactUsForm