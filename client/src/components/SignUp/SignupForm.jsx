import React from 'react';
import { useNavigate } from 'react-router-dom';


const SignUpForm = () => {

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const handleGoogleSignUp = () => {
        alert('Google Sign-up integration would be implemented here.');
    };

    const handleLoginRedirect = (e) => {
        navigate('/login')
    };

    return (
        <div className="flex-2/3 bg-white flex flex-col justify-center items-center p-8 relative z-20 shadow-lg md:shadow-2xl min-h-screen md:min-h-auto">
            <div className="w-full max-w-md animate-fadeInUp px-4 sm:px-6 md:px-0">

                <div className="text-center mb-8 px-2 sm:px-0">
                    <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">Create your account</h1>
                    <p className="text-base sm:text-lg text-gray-600">Join TravelSync in seconds</p>
                </div>

                

                <div className="text-center my-6 relative text-gray-400 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-200">
                    <span className="bg-white px-4 text-sm sm:text-base"></span>
                </div>

                <form id="signupForm" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstname" className="block mb-2 text-gray-800 font-medium text-sm sm:text-base">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastname" className="block mb-2 text-gray-800 font-medium text-sm sm:text-base">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-gray-800 font-medium text-sm sm:text-base">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md"
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
                            className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-md"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out mb-6 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 signup-btn"
                    >
                        Sign up
                    </button>
                </form>

                <div className="text-center text-gray-600 text-sm sm:text-base">
                    Already have an account?{' '}
                    <a
                        href="#"
                        className="text-indigo-500 font-semibold hover:text-indigo-600 transition-colors duration-300 ease-in-out"
                        onClick={handleLoginRedirect}
                    >
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
