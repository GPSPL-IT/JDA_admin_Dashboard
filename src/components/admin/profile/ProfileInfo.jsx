import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ProfileInfo = ({ profile, onEditClick, onLogout }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-6 sm:p-8 border border-green-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <FaUser className="text-green-600 mr-3" />
          {t('profile.profile')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onEditClick}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaEdit className="mr-2" />
            {t('profile.editProfile')}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaSignOutAlt className="mr-2" />
            {t('profile.logout')}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <label className=" text-gray-600 text-sm font-semibold mb-2 flex items-center">
            <FaUser className="text-green-600 mr-2" />
            {t('profile.name')}
          </label>
          <p className="text-gray-800 font-medium text-lg">{profile.name}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <label className=" text-gray-600 text-sm font-semibold mb-2 flex items-center">
            <FaEnvelope className="text-green-600 mr-2" />
            {t('profile.email')}
          </label>
          <p className="text-gray-800 font-medium text-lg">{profile.email}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <label className=" text-gray-600 text-sm font-semibold mb-2 flex items-center">
            <FaPhone className="text-green-600 mr-2" />
            {t('profile.mobile')}
          </label>
          <p className="text-gray-800 font-medium text-lg">{profile.contact}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <label className=" text-gray-600 text-sm font-semibold mb-2 flex items-center">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            {t('profile.location')}
          </label>
          <p className="text-gray-800 font-medium text-lg">{profile.location}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <label className=" text-gray-600 text-sm font-semibold mb-2 flex items-center">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            {t('profile.state')}
          </label>
          <p className="text-gray-800 font-medium text-lg">{profile.state}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
          <label className=" text-gray-600 text-sm font-semibold mb-2 flex items-center">
            <FaUser className="text-green-600 mr-2" />
            {t('profile.designation')}
          </label>
          <p className="text-gray-800 font-medium text-lg">{profile.designation}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo; 