import React from 'react'
import Template from '../components/core/Auth/Template';
import imageSignup from '../assets/Images/signup.webp';

const Signup = () => {
  return (
    <div>
        <Template
            heading = 'Join the millions learning to code with StudyNotion for free'
            subheading1 = 'Build skills from today, tomorrow, and beyond'
            subheading2='Education to future proof your career'
            formType='Signup'
            image={imageSignup}
        ></Template>
    </div>
  )
}
export default Signup;