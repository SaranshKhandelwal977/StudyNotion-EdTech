import React from 'react'
import Template from '../components/core/Auth/Template';
import imageLogin from '../assets/Images/login.webp';

const Login = () => {
  return (
    <div>
        <Template
            heading = 'Welcome Back'
            subheading1 = 'Build skills from today, tomorrow, and beyond'
            subheading2='Education to future proof your career'
            formType='Login'
            image={imageLogin}
        ></Template>
    </div>
  )
}
export default Login;