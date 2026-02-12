import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Navbar } from './index';

const Layout = ({ children }) => {
  // Sidebar closed by default on mobile
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin/dashboard';

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Only show if not in admin dashboard */}
      {!isAdminDashboard && <Header toggleNavbar={toggleNavbar} isNavbarOpen={isNavbarOpen} />}

      <div className="flex flex-1 pt-20">
        {/* Navbar - Only show if not in admin dashboard */}
        {!isAdminDashboard && (
          <div className={`
            fixed left-0 top-20 bottom-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}>
            <Navbar />
          </div>
        )}

        {/* Main Content */}
        <div className={`
          flex-1 flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${!isAdminDashboard ? (isNavbarOpen ? 'md:ml-24' : 'ml-0') : 'ml-0'}
          ${!isAdminDashboard ? 'md:ml-24' : ''}
        `}>
          <main className="flex-1 min-h-screen">
            {children}
          </main>
        </div>

        {/* Mobile Overlay Backdrop */}
        {isNavbarOpen && !isAdminDashboard && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
            onClick={toggleNavbar}
            aria-label="Close navigation"
          />
        )}
      </div>
    </div>
  );
};

export default Layout; 