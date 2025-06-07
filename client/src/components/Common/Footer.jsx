import React from 'react'

function Footer() {
  return (
    <footer id='contact' className="bg-gray-900 text-white pt-20 pl-56 ">
      {/* Centered container with max width */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          {/* Column 1 */}
          <div>
            <h3 className="text-indigo-400 font-semibold text-lg mb-3">TravelSync</h3>
            <p className="text-white">
              Your intelligent travel companion for <br /> seamless journeys worldwide.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-indigo-400 font-semibold text-lg mb-3">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Flight Tracking</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Weather Intelligence</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Emergency Network</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">AI Trip Planning</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-indigo-400 font-semibold text-lg mb-3">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 pr-56 pb-10 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; 2025 TravelSync. All rights reserved. Built with ❤️ for travelers worldwide.
      </div>
    </footer>
  )
}

export default Footer
