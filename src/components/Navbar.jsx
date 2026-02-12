import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUserShield,
  FaCalendarAlt,
  FaFileDownload,
  FaImages
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const navLinks = [
    { path: '/', icon: FaUserShield, title: 'home' },
    { path: '/admin', icon: FaUserShield, title: 'admin.title' },
    { path: '/events', icon: FaCalendarAlt, title: 'events.title' },
    { path: '/reports', icon: FaFileDownload, title: 'reports.title' },
    { path: '/gallery', icon: FaImages, title: 'gallery.title' }
  ];

  return (
    <aside className="h-full w-24 bg-white shadow-xl overflow-y-auto border-r border-gray-100 custom-scrollbar z-30 flex flex-col">
      {/*Navigation Divider */}
      <div className="py-4 px-2 mb-2 flex justify-center">
        <div className="h-1.5 w-12 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full shadow-sm"></div>
      </div>

      {/* Language Selector */}
      <div className="px-2 pb-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-1.5 border border-gray-200 shadow-inner">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`w-full py-2 text-xs font-bold rounded-xl transition-all duration-300 transform ${i18n.language === 'en'
                    ? 'bg-white text-[#2E7D32] shadow-md scale-105 ring-2 ring-[#2E7D32]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
              >
                Eng
              </button>
              <button
                onClick={() => i18n.changeLanguage('hi')}
                className={`w-full py-2 text-xs font-bold rounded-xl transition-all duration-300 transform ${i18n.language === 'hi'
                    ? 'bg-white text-[#2E7D32] shadow-md scale-105 ring-2 ring-[#2E7D32]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col items-center space-y-3 px-2 flex-1">
        {navLinks.map(({ path, icon: Icon, title }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex flex-col items-center w-full aspect-square justify-center rounded-2xl transition-all duration-300 group relative overflow-hidden transform
              ${isActive
                ? 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white shadow-xl shadow-green-900/30 scale-105'
                : 'text-gray-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:text-[#2E7D32] hover:shadow-lg hover:scale-105'
              }
            `}
            title={t(title)}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`
                    text-2xl mb-1.5 transition-all duration-300 transform
                    ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}
                  `}
                />
                <span
                  className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${isActive ? 'text-white' : 'text-current'
                    }`}
                >
                  {t(title)}
                </span>

                {/* Active Indicator Bar with Glow */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg shadow-white/50 animate-pulse" />
                )}

                {/* Subtle Background Pattern for Active State */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Navbar;
