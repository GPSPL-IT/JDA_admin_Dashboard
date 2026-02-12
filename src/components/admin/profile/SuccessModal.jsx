import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const SuccessModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100 animate-pulse">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
          <FaCheckCircle className="text-white text-4xl animate-bounce" />
        </div>
        
        {/* Success Message */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('profile.success')}</h3>
        <p className="text-gray-600 mb-6 text-lg">
          {t('profile.success')}
        </p>
        
        {/* Animated Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto"
        >
          <FaCheckCircle className="mr-2" />
          {t('profile.apply')}
        </button>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 