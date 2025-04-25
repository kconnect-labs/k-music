import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is already authenticated
        const userData = await AuthService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
        
        // Check if profile setup is needed
        const needsSetup = await AuthService.needsProfileSetup();
        setNeedsProfileSetup(needsSetup);
        
        // Also check with the server for current auth status
        const authResponse = await AuthService.checkAuth();
        
        if (authResponse.isAuthenticated && authResponse.user) {
          setUser(authResponse.user);
          setNeedsProfileSetup(false);
        } else if (authResponse.needsProfileSetup) {
          setUser(null);
          setNeedsProfileSetup(true);
        } else {
          setUser(null);
          setNeedsProfileSetup(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setError(err.message || "Authentication check failed");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (usernameOrEmail, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(usernameOrEmail, password);
      
      if (response.success) {
        if (response.needsProfileSetup) {
          setNeedsProfileSetup(true);
          setUser(null);
        } else if (response.user) {
          setUser(response.user);
          setNeedsProfileSetup(false);
        }
        return { success: true, needsProfileSetup: response.needsProfileSetup };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.register(username, email, password);
      
      if (response.success) {
        // Successful registration doesn't log the user in yet
        // They need to verify email first
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Setup profile function
  const setupProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.setupProfile(profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        setNeedsProfileSetup(false);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.error || 'Profile setup failed');
      }
    } catch (err) {
      console.error("Profile setup error:", err);
      setError(err.response?.data?.error || err.message || "Profile setup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await AuthService.logout();
      
      setUser(null);
      setNeedsProfileSetup(false);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || "Logout failed");
      // Still clear user data even if API call fails
      setUser(null);
      setNeedsProfileSetup(false);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    needsProfileSetup,
    login,
    register,
    setupProfile,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 