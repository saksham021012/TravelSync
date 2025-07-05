import React, { useState } from "react";
import {
  Grid3X3,
  Mountain,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../../services/Operations/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", href: "/my-profile", icon: <Grid3X3 className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Trips", href: "/my-trips", icon: <Mountain className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Itineraries", href: "/my-itineraries", icon: <Calendar className="w-4 h-4 mr-3" /> },
    { label: "Alerts", href: "/my-alerts", icon: <Bell className="w-4 h-4 mr-3 opacity-70" /> },
    { label: "Settings", href: "/profile", icon: <Settings className="w-4 h-4 mr-3 opacity-70" /> },
  ];

  const handleLogout = () => dispatch(logout(navigate));

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleNavClick = (href) => {
    setIsOpen(false);
    window.location.href = href;
  };

  return (
    <>
      {/* Hamburger toggle (mobile only) */}
      <button
        className="md:hidden cursor-pointer fixed top-14 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Overlay on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed rounded-xl top-0 left-0 w-40 md:w-60 bg-white z-50 transform transition-transform duration-300  md:translate-x-0 md:static md:block md:h-full
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar"
      >
        <div className="py-2">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(link.href)}
              className="w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1 border-transparent cursor-pointer"
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:translate-x-1 border-transparent hover:border-red-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-3 opacity-70" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Confirm Logout</h2>
              
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to logout? 
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 cursor-pointer rounded-md transition-colors hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;