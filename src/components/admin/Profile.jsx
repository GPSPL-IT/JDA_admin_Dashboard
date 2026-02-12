import React, { useState } from 'react';
import { FaUserCircle, FaEdit, FaTrash, FaSignOutAlt, FaSave, FaCamera, FaFacebook, FaTwitter, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { 
  ProfileCard, 
  ProfileEditForm, 
  ProfileInfo, 
  SuccessModal 
} from './profile/index';
import { useTranslation } from 'react-i18next';

const initialProfile = {
  name: 'Chetan Sharma',
  username: 'admin',
  designation: 'Administrator',
  location: 'Jaipur',
  state: 'Rajasthan',
  contact: '9876543210',
  email: 'chetan123@gmail.com',
  avatar: null
};

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  // Profile state
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  
  // UI state
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Form validation state
  const [isMobileChanged, setIsMobileChanged] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [emailPassword, setEmailPassword] = useState('');
  const [emailPasswordError, setEmailPasswordError] = useState('');
  
  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle profile field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    
    // Check if mobile number changed
    if (name === 'contact' && value !== originalProfile.contact) {
      setIsMobileChanged(true);
    } else if (name === 'contact' && value === originalProfile.contact) {
      setIsMobileChanged(false);
    }

    // Check if email changed
    if (name === 'email' && value !== originalProfile.email) {
      setIsEmailChanged(true);
    } else if (name === 'email' && value === originalProfile.email) {
      setIsEmailChanged(false);
      setEmailPassword('');
      setEmailPasswordError('');
    }
  };

  // Handle password field changes
  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    
    // Clear password error when user starts typing
    if (passwordError) setPasswordError('');
  };

  // Handle email password changes
  const onEmailPasswordChange = (e) => {
    setEmailPassword(e.target.value);
    if (emailPasswordError) setEmailPasswordError('');
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image click
  const handleImageClick = () => {
    if (editMode) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  // Handle OTP changes
  const onOtpChange = (e) => {
    setOtpValue(e.target.value);
    if (otpError) setOtpError('');
  };

  // Handle profile save
  const handleSave = () => {
    // Password validation
    if (password && password !== confirmPassword) {
      setPasswordError(t('profile.passwordsDoNotMatch'));
      return;
    }
    
    if (password && password.length < 6) {
      setPasswordError(t('profile.passwordMinLength'));
      return;
    }

    // Email password validation
    if (isEmailChanged && !emailPassword) {
      setEmailPasswordError(t('profile.currentPasswordRequired'));
      return;
    }

    if (isEmailChanged && emailPassword !== 'admin123') { // Replace with actual password validation
      setEmailPasswordError(t('profile.invalidCurrentPassword'));
      return;
    }

    // Mobile number validation
    if (isMobileChanged && !showOtpField) {
      // Generate OTP (simulate)
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(generatedOTP);
      setShowOtpField(true);
      alert(t('profile.otpSent', { contact: profile.contact, otp: generatedOTP }));
      return;
    }

    // If OTP is required but not provided
    if (isMobileChanged && showOtpField && !otpValue) {
      setOtpError(t('profile.enterOtp'));
      return;
    }

    // If OTP is provided, verify it
    if (isMobileChanged && showOtpField && otpValue) {
      if (otpValue !== otpCode) {
        setOtpError(t('profile.invalidOtp'));
        return;
      }
    }

    // Save profile
    const updatedProfile = { ...profile };
    if (imagePreview) {
      updatedProfile.avatar = imagePreview;
    }
    
    setProfile(updatedProfile);
    setOriginalProfile(updatedProfile);
    
    // Reset all form states
    resetFormStates();
    
    // Show success modal
    setShowSuccessModal(true);
  };

  // Handle form cancel
  const handleCancel = () => {
    setEditMode(false);
    resetFormStates();
    // Reset profile to original state
    setProfile(originalProfile);
  };

  // Reset all form states
  const resetFormStates = () => {
    setEditMode(false);
    setImagePreview(null);
    setIsMobileChanged(false);
    setShowOtpField(false);
    setOtpValue('');
    setOtpError('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsEmailChanged(false);
    setEmailPassword('');
    setEmailPasswordError('');
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm(t('profile.areYouSureLogout'))) {
      try {
        if (logout) {
          logout();
        } else {
          // Fallback logout
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Force logout
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  // Handle edit mode toggle
  const handleEditClick = () => {
    setEditMode(true);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:w-1/3">
            <ProfileCard 
              profile={profile}
              onImageClick={handleImageClick}
              onImageChange={handleImageChange}
              imagePreview={imagePreview}
              editMode={editMode}
            />
          </div>

          {/* Profile Content */}
          <div className="lg:w-2/3">
            {editMode ? (
              <ProfileEditForm
                profile={profile}
                onChange={handleChange}
                onSave={handleSave}
                onCancel={handleCancel}
                isMobileChanged={isMobileChanged}
                showOtpField={showOtpField}
                otpValue={otpValue}
                onOtpChange={onOtpChange}
                otpError={otpError}
                password={password}
                confirmPassword={confirmPassword}
                onPasswordChange={onPasswordChange}
                passwordError={passwordError}
                editMode={editMode}
                isEmailChanged={isEmailChanged}
                emailPassword={emailPassword}
                onEmailPasswordChange={onEmailPasswordChange}
                emailPasswordError={emailPasswordError}
              />
            ) : (
              <ProfileInfo
                profile={profile}
                onEditClick={handleEditClick}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        open={showSuccessModal} 
        onClose={handleSuccessModalClose} 
      />
    </div>
  );
};

export default Profile; 