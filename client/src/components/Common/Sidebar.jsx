import React from "react";
import { NavLink } from "react-router-dom";
import {
  Grid3X3,
  Mountain,
  Calendar,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const links = [
    { label: "Dashboard", href: "/my-profile", icon: <Grid3X3 className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Trips", href: "/my-trips", icon: <Mountain className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Itineraries", href: "/my-itineraries", icon: <Calendar className="w-4 h-4 mr-3" /> },
    { label: "Alerts", href: "/my-alerts", icon: <Bell className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Logout", href: "/logout", icon: <LogOut className="w-4 h-4 mr-3 opacity-70" /> },
  ];

  return (
    <nav className="w-60 bg-white shadow-sm fixed h-full transition-transform duration-300 z-50">
      

      <div className="py-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.href}
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
  );
};

export default Sidebar;
