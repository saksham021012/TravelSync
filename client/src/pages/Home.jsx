import React from 'react'
import Features from '../components/Home/Features'
import CTASection from '../components/Home/CtaSection'
import Footer from '../components/Common/Footer'
import HeroSection from '../components/Home/HeroSection'





function Home() {
    return (
        <div>
            {/* Hero section  */}
            <HeroSection/>

            {/* Features section  */}
            <Features />

            {/* Cta section  */}
            <CTASection />

            {/* Footer  */}
            <Footer />
        </div>

    )
}

export default Home
