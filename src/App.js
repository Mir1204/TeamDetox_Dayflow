/**
 * Main Application Component
 * 
 * This is the root component that manages the application's routing,
 * authentication state, and navigation between different pages.
 * 
 * Features:
 * - Authentication management with localStorage persistence
 * - Page routing and navigation
 * - Module-specific navigation support
 * - User session management
 * 
 * @component
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminProfile from './pages/AdminProfile';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import EmployeeDashboard from './pages/EmployeeDashboard';

/**
 * App Component - Main application entry point
 * 
 * Manages application state, authentication, and routing
 * Uses localStorage for session persistence
 * 
 * @returns {JSX.Element} The main application component
 */
function App() {
  // ========== STATE MANAGEMENT ==========
  
  /** Current active page/route */
  const [currentPage, setCurrentPage] = useState('signin');
  
  /** Current authenticated user data */
  const [user, setUser] = useState(null);
  
  /** Active module for dashboard navigation */
  const [activeModule, setActiveModule] = useState('employees');

  // ========== AUTHENTICATION PERSISTENCE ==========
  
  /**
   * Initialize application state from localStorage
   * Checks for existing user session and restores it
   * Handles error cases gracefully
   */
  useEffect(() => {
    try {
      // Retrieve authentication state from localStorage
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const savedUser = localStorage.getItem('user');
      
      // Validate and restore user session if it exists
      if (isLoggedIn === 'true' && savedUser) {
        const userData = JSON.parse(savedUser);
        
        // Validate user data structure
        if (userData && userData.email) {
          setUser(userData);
          setCurrentPage('dashboard');
        } else {
          // Invalid user data, clear storage
          throw new Error('Invalid user data structure');
        }
      }
    } catch (error) {
      // Handle parsing errors or corrupted data
      console.error('Error restoring user session:', error);
      
      // Clear corrupted data from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      
      // Reset to signin page
      setCurrentPage('signin');
      setUser(null);
    }
  }, []); // Empty dependency array - run once on mount

  // ========== AUTHENTICATION HANDLERS ==========
  
  /**
   * Handle successful user login
   * Stores user data in localStorage and navigates to dashboard
   * 
   * @param {Object} userData - User authentication data
   * @param {string} userData.email - User email
   * @param {string} userData.name - User name
   * @param {string} userData.role - User role (admin/employee)
   */
  const handleLogin = useCallback((userData) => {
    try {
      // Validate user data
      if (!userData || !userData.email) {
        throw new Error('Invalid user data provided');
      }
      
      // Set user state
      setUser(userData);
      
      // Persist authentication state
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Navigate to dashboard
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error gracefully
    }
  }, []);

  /**
   * Handle successful user signup
   * Similar to login but for new user registration
   * 
   * @param {Object} userData - New user data from registration
   */
  const handleSignupSuccess = useCallback((userData) => {
    try {
      // Validate user data
      if (!userData || !userData.email) {
        throw new Error('Invalid signup data provided');
      }
      
      // Set user state
      setUser(userData);
      
      // Persist authentication state
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Navigate to dashboard
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      // Handle signup error gracefully
    }
  }, []);

  /**
   * Handle user logout
   * Clears user data and authentication state
   * Redirects to signin page
   */
  const handleLogout = useCallback(() => {
    try {
      // Clear state
      setUser(null);
      setActiveModule('employees'); // Reset to default module
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      
      // Navigate to signin
      setCurrentPage('signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation to signin even on error
      setCurrentPage('signin');
    }
  }, []);

  // ========== NAVIGATION HANDLERS ==========
  
  /**
   * Handle module navigation from profile page
   * Sets active module and navigates to dashboard
   * 
   * @param {string} module - Target module (employees, attendance, timeoff)
   */
  const handleModuleNavigation = useCallback((module) => {
    setActiveModule(module);
    setCurrentPage('dashboard');
  }, []);

  // ========== PAGE RENDERING ==========
  
  /**
   * Render appropriate page component based on current route
   * Uses memoization for performance optimization
   * 
   * @returns {JSX.Element} Current page component
   */
  const renderPage = useMemo(() => {
    try {
      switch(currentPage) {
        case 'signup':
          return (
            <SignupPage 
              onSwitchToSignin={() => setCurrentPage('signin')}
              onSignupSuccess={handleSignupSuccess}
            />
          );
          
        case 'dashboard':
          // Only render dashboard if user is authenticated
          if (!user) {
            console.warn('Attempting to access dashboard without authentication');
            setCurrentPage('signin');
            return null;
          }
          
          return (
            <EmployeeDashboard 
              onLogout={handleLogout}
              onNavigateToProfile={() => setCurrentPage('profile')}
              initialModule={activeModule}
              user={user}
            />
          );
          
        case 'profile':
          // Only render profile if user is authenticated
          if (!user) {
            console.warn('Attempting to access profile without authentication');
            setCurrentPage('signin');
            return null;
          }
          
          return (
            <AdminProfile 
              onBackToDashboard={() => setCurrentPage('dashboard')}
              onLogout={handleLogout}
              onNavigateToModule={handleModuleNavigation}
              user={user}
            />
          );
          
        case 'signin':
        default:
          return (
            <SigninPage 
              onSwitchToSignup={() => setCurrentPage('signup')}
              onLoginSuccess={handleLogin}
            />
          );
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      // Fallback to signin page on any rendering error
      return (
        <SigninPage 
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleLogin}
        />
      );
    }
  }, [currentPage, user, activeModule, handleLogin, handleSignupSuccess, handleLogout, handleModuleNavigation]);

  // ========== COMPONENT RENDER ==========
  
  return (
    <div className="App">
      {/* 
        Main application container
        Renders current page based on authentication state and navigation
      */}
      {renderPage}
    </div>
  );
}

// ========== COMPONENT EXPORT ==========

/**
 * Export the main App component
 * This is the entry point for the entire application
 */
export default App;