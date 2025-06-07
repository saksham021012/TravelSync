import React from 'react'
import { useNavigate } from 'react-router-dom';
 

function CtaSection() {

    const navigate = useNavigate();
    const onClickGST = ()=>{
        navigate('/signup')
    }
    return (
        <section className="py-24 bg-gradient-to-br from-gray-800 to-gray-700
 text-white text-center">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                    Ready to Transform Your Travel?
                </h2>
                <p className="text-md md:text-lg mb-8 opacity-90">
                    Join thousands of smart travelers who trust TravelSync for seamless, worry-free journeys.
                </p>
                <a  
                    onClick={onClickGST}
                    className="inline-block px-8 py-4 text-lg font-semibold bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-100 transition transform cursor-pointer hover:-translate-y-1"
                >
                    Get Started Today
                </a>
            </div>
        </section>
    );

}


export default CtaSection



