import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaSave, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaLock } from 'react-icons/fa';

const ProfileEditForm = ({ 
  profile, 
  onChange, 
  onSave, 
  onCancel, 
  isMobileChanged, 
  showOtpField, 
  otpValue, 
  onOtpChange, 
  otpError, 
  password, 
  confirmPassword, 
  onPasswordChange, 
  passwordError, 
  editMode, 
  isEmailChanged, 
  emailPassword, 
  onEmailPasswordChange, 
  emailPasswordError 
}) => {
  const { t } = useTranslation();
  return (
    <form className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-6 sm:p-8 w-full border border-green-200" onSubmit={e => { e.preventDefault(); onSave(); }}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaEdit className="text-green-600 mr-3" />
        {t('profile.editProfile')}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaUser className="text-green-600 mr-2" />
            {t('profile.name')}
          </label>
          <input 
            type="text" 
            name="name" 
            value={profile.name} 
            onChange={onChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaEnvelope className="text-green-600 mr-2" />
            {t('profile.email')}
          </label>
          <input 
            type="email" 
            name="email" 
            value={profile.email} 
            onChange={onChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
          />
          {isEmailChanged && (
            <div className="mt-3">
              <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
                <FaLock className="text-green-600 mr-2" />
                {t('profile.currentPasswordRequired')}
              </label>
              <input 
                type="password" 
                name="emailPassword" 
                value={emailPassword} 
                onChange={onEmailPasswordChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
                placeholder={t('profile.currentPassword')}
              />
              {emailPasswordError && <div className="text-red-600 text-sm mt-1">{emailPasswordError}</div>}
            </div>
          )}
        </div>
        
        <div>
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            {t('profile.location')}
          </label>
          <input 
            type="text" 
            name="location" 
            value={profile.location} 
            onChange={onChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
          />
        </div>
        
        <div>
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            {t('profile.state')}
          </label>
          <input 
            type="text" 
            name="state" 
            value={profile.state} 
            onChange={onChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaPhone className="text-green-600 mr-2" />
            {t('profile.mobile')}
          </label>
          <input 
            type="text" 
            name="contact" 
            value={profile.contact} 
            onChange={onChange} 
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base ${isMobileChanged ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'}`} 
          />
          {isMobileChanged && !showOtpField && (
            <div className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg mt-2 border border-yellow-200">
              <strong>{t('profile.mobile')}</strong> {t('profile.otpSent', { contact: profile.contact, otp: '' })}
            </div>
          )}
          {showOtpField && (
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">{t('profile.enterOtp')}</label>
              <input
                type="text"
                value={otpValue}
                onChange={onOtpChange}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={6}
                placeholder={t('profile.enterOtp')}
              />
              {otpError && <div className="text-red-600 text-sm mt-1">{otpError}</div>}
              <div className="text-sm text-gray-600 mt-1">{t('profile.otpSent', { contact: profile.contact, otp: '' })}</div>
            </div>
          )}
        </div>
        
        <div>
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaLock className="text-green-600 mr-2" />
            {t('profile.newPassword')}
          </label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onPasswordChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
            placeholder={t('profile.newPassword')}
          />
        </div>
        
        <div>
          <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FaLock className="text-green-600 mr-2" />
            {t('profile.confirmPassword')}
          </label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={confirmPassword} 
            onChange={onPasswordChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base" 
            placeholder={t('profile.confirmPassword')}
          />
          {passwordError && <div className="text-red-600 text-sm mt-1">{passwordError}</div>}
        </div>
      </div>
     
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          type="submit" 
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
        >
          <FaSave className="mr-2" />
          {t('profile.save')}
        </button>
        <button 
          type="button" 
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105" 
          onClick={onCancel}
        >
          {t('profile.cancel')}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm; 