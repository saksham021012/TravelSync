import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Grid3X3,
  Mountain,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/my-profile", icon: <Grid3X3 className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Trips", href: "/my-trips", icon: <Mountain className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Itineraries", href: "/my-itineraries", icon: <Calendar className="w-4 h-4 mr-3" /> },
    { label: "Alerts", href: "/my-alerts", icon: <Bell className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Settings", href: "/profile", icon: <Settings className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Logout", href: "/logout", icon: <LogOut className="w-4 h-4 mr-3 opacity-70" /> },
  ];

  return (
    <>
      {/* Hamburger toggle (mobile only) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Overlay on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0  w-60 bg-white shadow-sm z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block`}
      >
        <div className="py-2">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.href}
              onClick={() => setIsOpen(false)} // Auto-close on mobile
              className={({ isActive }) =>
                `flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-all duration-200 ${
                  isActive
                    ? "text-purple-600 bg-slate-50 border-purple-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1 border-transparent"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
