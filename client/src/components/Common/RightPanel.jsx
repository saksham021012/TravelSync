
import React from 'react';

const RightPanel = ({ mode = 'signup' }) => {
  const isLogin = mode === 'login';
  return (
    <div className="flex-[45%] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 floating-elements">
        <div className="absolute text-5xl opacity-30 animate-floatAround top-1/5 left-[15%]">✈️</div>
        <div className="absolute text-5xl opacity-30 animate-floatAround animation-delay-4s top-3/5 right-[20%]">🌍</div>
        <div className="absolute text-5xl opacity-30 animate-floatAround animation-delay-8s top-4/5 left-[25%]">🧳</div>
        <div className="absolute text-5xl opacity-30 animate-floatAround animation-delay-2s top-[30%] right-[30%]">📍</div>
      </div>

      <svg className="w-4/5 max-w-xl h-auto animate-float translate-y-[-200px]" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        {/* Background clouds */}
        <ellipse cx="150" cy="100" rx="60" ry="30" fill="rgba(255,255,255,0.2)"/>
        <ellipse cx="650" cy="80" rx="80" ry="40" fill="rgba(255,255,255,0.15)"/>
        <ellipse cx="500" cy="120" rx="50" ry="25" fill="rgba(255,255,255,0.1)"/>
        
        {/* Airplane */}
        <g transform="translate(600, 60)">
            <path d="M0 0 L50 10 L60 0 L50 -10 Z" fill="#ffffff" opacity="0.8"/>
            <path d="M10 0 L30 15 L35 10 L15 -5 Z" fill="#ffffff" opacity="0.6"/>
            <path d="M10 0 L30 -15 L35 -10 L15 5 Z" fill="#ffffff" opacity="0.6"/>
        </g>
        
        {/* Mountains */}
        <path d="M0 400 L100 250 L200 300 L300 200 L400 280 L500 180 L600 240 L700 160 L800 220 L800 600 L0 600 Z" fill="rgba(255,255,255,0.1)"/>
        
        {/* Travelers Group */}
        <g transform="translate(150, 320)">
            {/* Person 1 */}
            <g>
                <circle cx="50" cy="50" r="20" fill="#FFE4B5"/>
                <rect x="35" y="70" width="30" height="50" rx="15" fill="#4A90E2"/>
                <rect x="30" y="80" width="40" height="30" rx="5" fill="#FFB74D"/>
                <rect x="45" y="120" width="10" height="25" fill="#8B4513"/>
                <rect x="45" y="145" width="15" height="8" fill="#2C3E50"/>
                {/* Backpack */}
                <rect x="25" y="75" width="15" height="25" rx="5" fill="#E74C3C"/>
                {/* Hat */}
                <ellipse cx="50" cy="35" rx="25" ry="8" fill="#F39C12"/>
                <circle cx="50" cy="35" r="15" fill="#F39C12"/>
            </g>
            
            {/* Person 2 */}
            <g>
                <circle cx="120" cy="55" r="18" fill="#FDBCB4"/>
                <rect x="105" y="73" width="30" height="45" rx="15" fill="#9B59B6"/>
                <rect x="100" y="83" width="40" height="28" rx="5" fill="#3498DB"/>
                <rect x="115" y="118" width="10" height="23" fill="#8B4513"/>
                <rect x="115" y="141" width="15" height="8" fill="#2C3E50"/>
                {/* Purse */}
                <rect x="90" y="85" width="12" height="15" rx="3" fill="#E91E63"/>
                {/* Hair */}
                <path d="M102 45 Q120 35 138 45 Q135 55 120 55 Q105 55 102 45" fill="#8B4513"/>
            </g>
            
            {/* Person 3 */}
            <g>
                <circle cx="190" cy="60" r="18" fill="#FFE4B5"/>
                <rect x="175" y="78" width="30" height="40" rx="15" fill="#27AE60"/>
                <rect x="170" y="88" width="40" height="25" rx="5" fill="#F1C40F"/>
                <rect x="185" y="118" width="10" height="22" fill="#8B4513"/>
                <rect x="185" y="140" width="15" height="8" fill="#2C3E50"/>
                {/* Glasses */}
                <circle cx="185" cy="58" r="8" fill="none" stroke="#2C3E50" strokeWidth="2"/>
                <circle cx="195" cy="58" r="8" fill="none" stroke="#2C3E50" strokeWidth="2"/>
                <line x1="193" y1="58" x2="187" y2="58" stroke="#2C3E50" strokeWidth="2"/>
                {/* Backpack */}
                <rect x="165" y="80" width="18" height="28" rx="5" fill="#8E44AD"/>
            </g>
            
            {/* Person 4 */}
            <g>
                <circle cx="260" cy="55" r="18" fill="#FDBCB4"/>
                <rect x="245" y="73" width="30" height="45" rx="15" fill="#F39C12"/>
                <rect x="240" y="83" width="40" height="28" rx="5" fill="#E74C3C"/>
                <rect x="255" y="118" width="10" height="23" fill="#8B4513"/>
                <rect x="255" y="141" width="15" height="8" fill="#2C3E50"/>
                {/* Camera */}
                <rect x="230" y="90" width="15" height="10" rx="2" fill="#34495E"/>
                <circle cx="237" cy="95" r="4" fill="#95A5A6"/>
                {/* Selfie stick */}
                <line x1="275" y1="85" x2="295" y2="75" stroke="#BDC3C7" strokeWidth="3"/>
                <rect x="293" y="72" width="8" height="6" fill="#2C3E50"/>
            </g>
        </g>
        
        {/* Luggage */}
        <g transform="translate(100, 450)">
            <rect x="0" y="0" width="25" height="35" rx="5" fill="#3498DB"/>
            <rect x="2" y="2" width="21" height="8" fill="#2980B9"/>
            <circle cx="5" cy="32" r="3" fill="#34495E"/>
            <circle cx="20" cy="32" r="3" fill="#34495E"/>
            <rect x="10" y="-5" width="5" height="8" fill="#7F8C8D"/>
        </g>
        
        <g transform="translate(300, 460)">
            <rect x="0" y="0" width="20" height="30" rx="3" fill="#E74C3C"/>
            <rect x="2" y="2" width="16" height="6" fill="#C0392B"/>
            <circle cx="4" cy="28" r="2" fill="#34495E"/>
            <circle cx="16" cy="28" r="2" fill="#34495E"/>
            <rect x="8" y="-4" width="4" height="6" fill="#7F8C8D"/>
        </g>
        
        <g transform="translate(500, 440)">
            <rect x="0" y="0" width="30" height="40" rx="6" fill="#9B59B6"/>
            <rect x="3" y="3" width="24" height="10" fill="#8E44AD"/>
            <circle cx="6" cy="37" r="4" fill="#34495E"/>
            <circle cx="24" cy="37" r="4" fill="#34495E"/>
            <rect x="12" y="-6" width="6" height="10" fill="#7F8C8D"/>
        </g>
        
        {/* Location Pin */}
        <g transform="translate(400, 200)">
            <path d="M20 0 C30 0 35 10 35 20 C35 35 20 50 20 50 C20 50 5 35 5 20 C5 10 10 0 20 0 Z" fill="#E74C3C"/>
            <circle cx="20" cy="20" r="8" fill="#ffffff"/>
        </g>
      </svg>

      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center text-white z-10">
        <h2 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
          {isLogin
            ? 'Continue Exploring'
            : 'Start Your Journey'}
        </h2>
        <p className="text-xl opacity-90 max-w-md mx-auto leading-relaxed">
          {isLogin
            ? 'Log in to continue planning, syncing, and experiencing your next adventure with TravelSync.'
            : 'Join thousands of travelers who trust TravelSync for seamless, worry-free adventures around the world.'}
        </p>
      </div>
    </div>
  );
};

export default RightPanel;