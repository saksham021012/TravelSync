import React from 'react'
import { useNavigate } from 'react-router-dom';

const svgBackground = `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201000%201000%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2250%22%20height%3D%2250%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2050%200%20L%200%200%200%2050%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.1)%22%20stroke-width%3D%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E")`;

function HeroSection() {

    const navigate = useNavigate();
    const onClickSYJ = ()=>{
        navigate('/signup')
    }
    return (
        <section id='about'
                style={{
                    // same as bg-gray-900 hex
                    backgroundImage: `${svgBackground}, linear-gradient(to bottom right, #667eea, #764ba2)`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto',
                }}
                className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white overflow-hidden">
                <div className="absolute opacity-10 animate-floatAround text-4xl " style={{ top: '20%', left: '10%' }}>✈️</div>
                <div className="absolute opacity-10 animate-floatAround text-4xl" style={{ top: '60%', right: '15%' }}>🌍</div>
                <div className="absolute opacity-10 animate-floatAround text-4xl" style={{ top: '30%', right: '30%' }}>⛅</div>

                <div className="relative z-10 px-4 max-w-3xl mx-auto">
                    <h1 className="text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white to-indigo-100 animate-glow">
                        Your Smart Travel Companion
                    </h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                        Experience seamless travel with real-time alerts, intelligent automation, and comprehensive travel insights—all in one powerful platform.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a onClick={onClickSYJ} className="inline-block bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-[30px] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
                            Start Your Journey
                        </a>
                        <a href="#features" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-[30px] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-[#667eea] hover:-translate-y-0.5">
                            Explore Features
                        </a>
                    </div>
                </div>
            </section>
    )
}

export default HeroSection
