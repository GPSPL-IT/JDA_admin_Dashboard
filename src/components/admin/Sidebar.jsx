import React, { useState } from 'react';
import {
  FaTree,
  FaUsers,
  FaChartBar,
  FaArrowLeft,
  FaTachometerAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ activeSection, setActiveSection, isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    plantation: false
  });

  const sections = [
    { id: 'dashboard', icon: <FaTachometerAlt />, label: t('sidebar.dashboard', 'Dashboard') },
    {
      id: 'plantation',
      icon: <FaTree />,
      label: t('sidebar.plantation', 'Plantation'),
      submenu: [
        { id: 'zonewise', label: t('sidebar.zonewise', 'Zone Wise') },
        { id: 'wardwise', label: t('sidebar.wardwise', 'Ward Wise') },
        { id: 'specieswise', label: t('sidebar.specieswise', 'Species Wise') },
        { id: 'event', label: t('sidebar.event', 'Event') }
      ]
    },
    { id: 'users', icon: <FaUsers />, label: t('sidebar.userManagement', 'User Management') },
    { id: 'reports', icon: <FaChartBar />, label: t('sidebar.reports', 'Reports') },
    { id: 'profile', icon: <FaUserCircle />, label: t('sidebar.profile', 'Profile') },
  ];

  const handleBack = () => {
    navigate('/');
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleSubmenuClick = (subItemId) => {
    setActiveSection(subItemId);
    // If the submenu is not expanded, expand it
    const parentId = subItemId.split('-')[0]; // Get parent id from submenu id
    if (!expandedMenus[parentId]) {
      setExpandedMenus(prev => ({
        ...prev,
        [parentId]: true
      }));
    }
    // Close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleMenuItemClick = (itemId) => {
    setActiveSection(itemId);
    // Close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const renderMenuItem = (item) => {
    if (item.submenu) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none
              ${activeSection.startsWith(item.id)
                ? 'bg-[#2E7D32] text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50 hover:text-[#2E7D32] hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-center">
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </div>
            {expandedMenus[item.id] ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {expandedMenus[item.id] && (
            <div className="ml-8 space-y-1">
              {item.submenu.map(subItem => (
                <button
                  key={subItem.id}
                  onClick={() => handleSubmenuClick(subItem.id)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none
                    ${activeSection === subItem.id
                      ? 'bg-[#2E7D32] text-white shadow-md'
                      : 'text-gray-600 hover:bg-white/50 hover:text-[#2E7D32]'
                    }
                  `}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleMenuItemClick(item.id)}
        className={`w-full flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none
          ${activeSection === item.id
            ? 'bg-[#2E7D32] text-white shadow-lg transform scale-[1.02]'
            : 'text-gray-700 hover:bg-white/50 hover:text-[#2E7D32] hover:shadow-sm'
          }
        `}
      >
        <span className="mr-3 text-lg">{item.icon}</span>
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 w-64 bg-white/80 backdrop-blur-md shadow-2xl flex flex-col h-screen z-40 border-r border-white/20
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center px-6 py-4 text-gray-700 hover:text-green-700 transition-colors duration-200 focus:outline-none border-b border-gray-200"
        >
          <FaArrowLeft className="mr-3 text-lg" />
          <span className="font-medium">{t('sidebar.backToHome', 'Back to Home')}</span>
        </button>

        {/* Admin Profile Section */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FaUserCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{user?.name || t('sidebar.adminUser', 'Admin User')}</h2>
              <p className="text-sm text-gray-600">{t('sidebar.administrator', 'Administrator')}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-white">
          {sections.map(renderMenuItem)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar; 