import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Memoized auth check to prevent unnecessary re-renders
  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // In a real app, you would validate the token here
        setIsAuthenticated(true);
        setUser({ token }); // You can decode and set user info here
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (token, userData = null) => {
    try {
      setIsLoading(true);
      localStorage.setItem('adminToken', token);
      setIsAuthenticated(true);
      setUser(userData || { token });
      
      // Optional: Validate token with backend
      // const response = await validateToken(token);
      // if (!response.valid) throw new Error('Invalid token');
      
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const clearAuth = useCallback(() => {
    try {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    clearAuth,
    checkAuthStatus
  }), [isAuthenticated, isLoading, user, login, logout, clearAuth, checkAuthStatus]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 