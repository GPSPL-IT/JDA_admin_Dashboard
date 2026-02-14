import React from 'react';
import { images } from '../assets/images';
import { FaBars } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Header = ({ toggleNavbar, isNavbarOpen }) => {
  const { t } = useTranslation(); // Translation hook

  return (
    <header className="w-full bg-white/80 shadow-md text-gray-800 px-4 sm:px-6 md:px-8 py-2 md:py-4 fixed top-0 z-50 border-b border-white/20 backdrop-blur-md transition-all duration-300">
      <div className="flex justify-between items-center h-full max-w-[1920px] mx-auto">
        {/* Toggle Button for mobile */}
        <button
          onClick={toggleNavbar}
          className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-300 md:hidden active:scale-95 text-gray-600 hover:text-[#2E7D32]"
          aria-label={t('toggle_navigation')}
        >
          <FaBars className="text-xl" />
        </button>

        {/* Left Logo with Text */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 p-2 rounded-xl hover:bg-white/40 transition-all duration-300 cursor-pointer group">
          <div className="w-10 h-9 sm:w-14 sm:h-13 md:w-16 md:h-15 lg:w-18 lg:h-17 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
            <img
              src={images.jdaLogo}
              alt={t('left_logo')}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <h2 className="text-red-600 font-bold text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight tracking-wide drop-shadow-sm">
              JDA
            </h2>
            <p className="text-red-600 text-[10px] sm:text-sm md:text-base lg:text-lg xl:text-xl leading-tight font-bold drop-shadow-sm">
              Jaipur Development Authority
            </p>
          </div>
        </div>

        {/* Center Logo */}
        {/* <div className="text-center flex-1 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-center gap-1 group cursor-pointer">
            <img
              src={images.geotree}
              alt={t('center_logo')}
              className="h-8 sm:h-10 md:h-14 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300 filter drop-shadow-md"
            />
          </div>
        </div> */}

        {/* Right Logo */}
        <div className="w-20 h-10 sm:w-28 sm:h-14 md:w-32 md:h-16 lg:w-36 lg:h-18 p-1.5 rounded-xl hover:bg-white/40 transition-all duration-300 cursor-pointer group flex items-center justify-center">
          <img
            src={images.geotree}
            alt={t('right_logo')}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 filter drop-shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
