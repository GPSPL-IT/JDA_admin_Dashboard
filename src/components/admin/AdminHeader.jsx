import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    logout();
    // Navigate back to home page
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 z-30 h-16 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Toggle button and title */}
        <div className="flex items-center space-x-4">
          {/* Toggle button - visible on mobile, hidden on desktop */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5 text-gray-600" />
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-800">
            GeoTree MIS
          </h1>
        </div>

        {/* Right side - Logout button */}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 