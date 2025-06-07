import React from 'react'

const features = [
    {
        icon: '✈️',
        title: 'Real-Time Flight Tracking',
        desc: 'Never miss a beat with live flight status updates, instant delay notifications, and gate changes. Get proactive alerts before disruptions affect your journey.',
    },
    {
        icon: '🌦️',
        title: 'Smart Weather Intelligence',
        desc: 'Receive destination-specific weather forecasts, severe weather warnings, and intelligent packing suggestions based on local climate conditions.',
    },
    {
        icon: '🚨',
        title: 'Emergency Assistance Network',
        desc: 'Access critical local emergency services instantly—hospitals, police stations, embassies, and emergency contacts tailored to your exact location.',
    },
    {
        icon: '📰',
        title: 'Localized Travel Intelligence',
        desc: 'Stay informed with curated local news, travel advisories, safety updates, and cultural insights that matter to your specific destination.',
    },
    {
        icon: '🎯',
        title: 'AI-Powered Trip Optimization',
        desc: 'Experience intelligent itinerary management with automatic flight parsing, smart scheduling suggestions, and personalized recommendations that adapt to your travel style.',
    },
    {
        icon: '🕒',
        title: 'Timezone-Aware Planning',
        desc: 'Seamlessly manage your schedule across time zones with automatic local time conversion, jet lag optimization, and smart scheduling that keeps you on track globally.',
    },
];

function Features() {
    return (
        <section id="features" className="py-24 bg-gradient-to-br from-slate-50 to-slate-200">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#667eea] to-[#764ba2] mb-4">
                        Intelligent Travel Features
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need for a worry-free travel experience
                    </p>
                </div>
                {/* features card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="feature-card relative bg-white p-10 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                        >
                            <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[15px] flex items-center justify-center mb-6 text-white text-[24px] animate-pulseCustom">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features
