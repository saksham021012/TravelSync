import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const svgBackground = `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201000%201000%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2250%22%20height%3D%2250%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2050%200%20L%200%200%200%2050%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.1)%22%20strokeWidth%3D%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E")`;

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const btlOnClick = ()=>{
        navigate("/login")
    }
    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 5000);
        }, 2000);
    };

    return (
        <div
            style={{
                // same as bg-gray-900 hex
                backgroundImage: `${svgBackground}, linear-gradient(to bottom right, #667eea, #764ba2)`,
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto',
            }}
            className="min-h-screen flex flex-col  text-gray-800">

            {/* Main Content */}
            <main className="flex flex-1 justify-center items-center relative px-4 py-10 overflow-hidden">
                {/* Floating Emojis */}
                <div className="absolute text-4xl opacity-20 animate-spin-slow left-8 top-20">✈️</div>
                <div className="absolute text-3xl opacity-20 right-12 bottom-20">🌍</div>
                <div className="absolute text-4xl opacity-20 right-28 top-32">⛅</div>
                <div className="absolute text-3xl opacity-20 left-16 bottom-24">🧳</div>
                <div className="absolute text-3xl opacity-20 left-3/4 top-1/3">🗺️</div>

                {/* Reset Form */}
                <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transition-all">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Reset your password</h1>
                        <p className="text-gray-600 mt-2">Have no fear. We'll email you instructions to reset your password.</p>
                    </div>

                    {submitted && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-700 text-white px-4 py-3 rounded-xl mb-4 animate-fade-in">
                            ✅ Password reset instructions sent to your email!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                                placeholder="Enter email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email.includes('@')}
                            className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ${loading || !email.includes('@') ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl'}`}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Sending...
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <a href="#" onClick={btlOnClick} className="flex justify-center items-center text-sm text-gray-600 hover:text-indigo-500 transition-all">
                            <button className="mr-1">←</button> Back To Login
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ForgotPassword;