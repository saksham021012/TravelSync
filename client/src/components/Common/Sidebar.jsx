import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { label: 'Dashboard', href: '/my-profile' },
    { label: 'Trips', href: '/my-trips' },
    { label: 'Itineraries', href: '/my-itineraries' },
    { label: 'Alerts', href: '/my-alerts' },
    { label: 'Settings', href: '/settings' },
    { label: 'Logout', href: '/logout' }, // You can hook this to a logout handler
  ];

  return (
    <nav className="w-72 bg-white shadow-lg p-8 fixed h-full overflow-y-auto z-50">
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                `block px-6 py-3 rounded-xl font-medium transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg translate-x-1'
                    : 'text-gray-500 hover:text-indigo-500 hover:translate-x-1 hover:bg-indigo-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
