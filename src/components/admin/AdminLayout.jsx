import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  Dashboard,
  ZoneWise,
  WardWise,
  SpeciesWise,
  Event,
  UserManagement,
  Reports,
  Profile
} from './index';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize to show/hide sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} />;
      // Plantation submenu routes
      case 'zonewise':
        return <ZoneWise />;
      case 'wardwise':
        return <WardWise />;
      case 'specieswise':
        return <SpeciesWise />;
      case 'event':
        return <Event />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Header */}
      <AdminHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
        pt-16
        min-h-screen
        w-full max-w-full overflow-x-hidden
      `}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout; 