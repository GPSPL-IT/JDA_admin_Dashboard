import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaCamera, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ProfileCard = ({ profile, onImageClick, onImageChange, imagePreview, editMode }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center w-full max-w-sm mx-auto border border-green-200">
      <div className="relative group cursor-pointer mb-4" onClick={onImageClick} title={t('profile.changePhoto')}>
        {imagePreview ? (
          <img src={imagePreview} alt={t('profile.avatar')} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-300 shadow-lg" />
        ) : profile.avatar ? (
          <img src={profile.avatar} alt={t('profile.avatar')} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-300 shadow-lg" />
        ) : (
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
            <FaUserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
          </div>
        )}
        {editMode && (
          <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg group-hover:bg-green-50 cursor-pointer transition-all duration-200 hover:scale-110">
            <FaCamera className="text-green-600 text-lg" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onImageChange}
              key={Date.now()} // Force re-render to fix selection issue
            />
          </label>
        )}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">{profile.name}</h2>
      <div className="text-green-700 font-semibold mb-3 text-center bg-green-100 px-4 py-1 rounded-full text-sm">
        {profile.designation}
      </div>
      <div className="space-y-2 w-full">
        <div className="flex items-center text-gray-600 text-sm">
          <FaMapMarkerAlt className="text-green-600 mr-2" />
          <span>{profile.location}, {profile.state}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaPhone className="text-green-600 mr-2" />
          <span>{profile.contact}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaEnvelope className="text-green-600 mr-2" />
          <span>{profile.email}</span>
        </div>
      </div>
      {editMode && (
        <button
          className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={onImageClick}
          type="button"
        >
          <FaCamera className="inline mr-2" />
          {t('profile.changePhoto')}
        </button>
      )}
    </div>
  );
};

export default ProfileCard; 