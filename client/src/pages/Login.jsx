import React from 'react'
import LoginForm from '../components/Login/LoginForm'
import RightPanel from '../components/Common/RightPanel'


function Login() {
    return (
        <div className='flex flex-col md:flex-row'>
            <LoginForm />
            <div className="hidden md:flex md:w-[45%]">
                <RightPanel />
            </div>

        </div>

    )
}

export default Login
