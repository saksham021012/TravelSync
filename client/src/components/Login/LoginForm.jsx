import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { login } from '../../services/Operations/authApi';



const LoginForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const {email, password} = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="flex-2/3 bg-white flex flex-col justify-center items-center p-8 relative z-20 shadow-lg md:shadow-2xl min-h-screen md:min-h-auto mt-3 ">
      <div className="w-full max-w-md animate-fadeInUp px-4 sm:px-6 md:px-0">


        <div className="text-center mb-8 px-2 sm:px-0">
          <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">Welcome back</h1>
          <p className="text-base sm:text-lg text-gray-600">Please enter your details</p>
        </div>



        <div className="text-center my-6 relative text-gray-400 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-200">
          <span className="bg-white px-4 text-sm sm:text-base"></span>
        </div>

        <form id="loginForm" onSubmit={handleOnSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-gray-800 font-medium text-sm sm:text-base">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-800 font-medium text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              id="password"
              name = "password"
              value = {password}
              onChange={handleOnChange}
              className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md"
              
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center mb-8 text-sm sm:text-base gap-3 sm:gap-0">

            <a
              href="#"
              className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors duration-300 ease-in-out"
              onClick={handleForgotPassword}
            >
              Forgot password
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out mb-6 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 signin-btn"
          >
            Sign in
          </button>
        </form>

        <div className="text-center text-gray-600 text-sm sm:text-base">
          Don't have an account?{' '}
          <a
            href="#"
            className="text-indigo-500 font-semibold hover:text-indigo-600 transition-colors duration-300 ease-in-out"
            onClick={handleSignUp}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
