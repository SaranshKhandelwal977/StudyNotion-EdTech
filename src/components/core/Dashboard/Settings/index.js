import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture';
import UpdateProfile from './UpdateProfile';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';

export default function Settings() {
  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Profile</h1>
        <ChangeProfilePicture/>
        <UpdateProfile/>
        <UpdatePassword/>
        <DeleteAccount/>
    </div>
  )
}