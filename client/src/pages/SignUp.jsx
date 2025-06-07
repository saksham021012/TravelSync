import React from 'react'
import RightPanel from '../components/Common/RightPanel'
import SignUpForm from '../components/SignUp/SignupForm'


function Login() {
    return (
        <div className='flex flex-col md:flex-row'>
            <SignUpForm />
            <div className="hidden md:flex md:w-[45%]">
                <RightPanel />
            </div>

        </div>

    )
}

export default Login
