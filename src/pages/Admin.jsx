import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaTree, FaLeaf, FaSeedling, FaMapMarkedAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { images } from '../assets/images';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Only redirect if authenticated and we're on the admin login page
    if (isAuthenticated && location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login('dummy-token'); // Replace with actual token from your API
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // You can add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden border border-green-200 bg-white h-[600px]">
        {/* Left Side - Enhanced with Project Theme */}
        <div className="hidden lg:flex flex-col justify-between items-center basis-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-6">
              <FaTree className="text-6xl text-white" />
            </div>
            <div className="absolute bottom-12 right-6">
              <FaLeaf className="text-4xl text-white" />
            </div>
            <div className="absolute top-1/2 left-1/4">
              <FaSeedling className="text-3xl text-white" />
            </div>
          </div>
          
          <div className="w-full relative z-10">
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                <img src={images.geotree} alt={t('center_logo', 'GeoTree Logo')} className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GeoTree</h1>
                <p className="text-green-100 text-xs">{t('adminPortal.subtitle', 'Management Information System')}</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">{t('adminPortal.empowering', 'Empowering Tree Plantation Management')}</h2>
            <p className="text-sm mb-4 text-green-100">{t('adminPortal.accessTools', 'Access comprehensive tools to monitor, manage, and analyze tree plantation data across districts and blocks.')}</p>
            
            {/* Feature Highlights */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <FaMapMarkedAlt className="text-lg mr-2 text-green-300" />
                <span className="text-sm">{t('adminPortal.feature1', 'Real-time plantation mapping and tracking')}</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-lg mr-2 text-green-300" />
                <span className="text-sm">{t('adminPortal.feature2', 'Manage individual and block plantations')}</span>
              </div>
              <div className="flex items-center">
                <FaChartLine className="text-lg mr-2 text-green-300" />
                <span className="text-sm">{t('adminPortal.feature3', 'Comprehensive reporting and analytics')}</span>
              </div>
            </div>
          </div>
          
        
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full lg:basis-1/2 flex flex-col justify-center px-6 py-8 bg-white">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <img src={images.geotree} alt={t('center_logo', 'GeoTree Logo')} className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-700">GeoTree MIS</h1>
                <p className="text-green-600 text-xs">{t('adminPortal.adminPortal', 'Admin Portal')}</p>
              </div>
            </div>
          </div>
          
          {/* Welcome Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FaTree className="text-2xl text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">{t('adminPortal.welcome', 'Welcome to Admin Portal')}</h1>
            <p className="text-gray-600 text-center text-sm">{t('adminPortal.accessDashboard', 'Access your tree plantation management dashboard')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.emailPlaceholder', 'Email Address')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white text-gray-900 transition-colors"
                placeholder={t('admin.emailPlaceholder', 'Enter your email address')}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.passwordPlaceholder', 'Password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white text-gray-900 transition-colors"
                  placeholder={t('admin.passwordPlaceholder', 'Enter your password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                  {t('adminPortal.rememberMe', 'Remember me')}
                </label>
              </div>
              <button type="button" className="text-xs text-green-600 hover:text-green-500 font-medium transition-colors">
                {t('admin.forgotPassword', 'Forgot password?')}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">{t('admin.signingIn', 'Signing In...')}</span>
                </>
              ) : (
                <>
                  <FaTree className="mr-2 h-4 w-4" />
                  {t('admin.signIn', 'Sign In to Dashboard')}
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-xs font-medium">{t('adminPortal.secureAccess', 'Secure Access')}</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          
          {/* Security Notice */}
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <FaLeaf className="text-green-600 mr-2 h-3 w-3" />
              <span className="text-xs text-green-700 font-medium">
                {t('adminPortal.securityNotice', 'Secure government portal for tree plantation management')}
              </span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p className="mt-1">© 2025 GeoTree  - {t('adminPortal.footer', 'Tree Plantation Management System')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;