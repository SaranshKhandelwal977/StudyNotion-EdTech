import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI";
import {toast} from "react-hot-toast"
import { setUser } from "../../slices/profileSlice"

const {UPDATE_PROFILE_API,DELETE_PROFILE_API,CHANGE_PASSWORD_API,UPDATE_DISPLAY_PICTURE_API} = settingsEndpoints;

export function updateProfilePicture(token, formData){
    return async(dispatch) =>{
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API, formData, {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`});
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Profile picture updated successfully")
            dispatch(setUser(response.data.data));
        }
        catch(error){
            console.log("Profile picture not updated successfully");
            toast.error('Could not update profile picture')
        }
        toast.dismiss(toastId)

    }
}

export function updateProfile(token, formData){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {Authorization: `Bearer ${token}`});
            console.log(response)
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            const userImage = response.data?.updatedUserDetails?.image
                ? response.data.updatedUserDetails.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            dispatch(setUser({ ...response.data.updatedUserDetails, image:userImage }))
            toast.success("Profile updated successfully")
        }
        catch(error){
            console.log(error);
            toast.error('Could not update profile')
        }
        toast.dismiss(toastId)
    }
    }


export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CHANGE_PASSWORD_API API RESPONSE", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Password Changed Successfully")

    } catch (error) {
      console.log("CHANGE_PASSWORD_API API ERROR", error)
      toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
  }

export function deleteProfile(token, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {Authorization:`Bearer ${token}`});
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Profile deletion successful")
            dispatch(logout(navigate))
        }
        catch(error){
            console.log("Can't delete profile");
            toast.error('Could not delete profile')
        }
        toast.dismiss(toastId)
    }
}
