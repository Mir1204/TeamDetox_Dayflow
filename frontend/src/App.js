import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminProfile from './pages/AdminProfile';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard'; // NEW
import HRDashboard from './pages/HRDashboard'; // NEW

function App() {
  const [currentPage, setCurrentPage] = useState('signin');
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('employees');

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const savedUser = localStorage.getItem('user');
      
      if (isLoggedIn === 'true' && savedUser) {
        const userData = JSON.parse(savedUser);
        
        if (userData && userData.email) {
          setUser(userData);
          setCurrentPage('dashboard');
        } else {
          throw new Error('Invalid user data structure');
        }
      }
    } catch (error) {
      console.error('Error restoring user session:', error);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      setCurrentPage('signin');
      setUser(null);
    }
  }, []);

  const handleLogin = useCallback((userData) => {
    try {
      if (!userData || !userData.email) {
        throw new Error('Invalid user data provided');
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  const handleSignupSuccess = useCallback((userData) => {
    try {
      if (!userData || !userData.email) {
        throw new Error('Invalid signup data provided');
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Signup error:', error);
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      setUser(null);
      setActiveModule('employees');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
      setCurrentPage('signin');
    } catch (error) {
      console.error('Logout error:', error);
      setCurrentPage('signin');
    }
  }, []);

  const handleModuleNavigation = useCallback((module) => {
    setActiveModule(module);
    setCurrentPage('dashboard');
  }, []);

  // Role-based dashboard component selection
  const getDashboardComponent = useCallback(() => {
    if (!user) return null;

    const role = user.role;

    // Admin gets full access dashboard
    if (role === 'Admin') {
      return (
        <AdminDashboard 
          onLogout={handleLogout}
          onNavigateToProfile={() => setCurrentPage('profile')}
          initialModule={activeModule}
          user={user}
        />
      );
    }

    // HR gets management dashboard
    if (role === 'HR') {
      return (
        <HRDashboard 
          onLogout={handleLogout}
          onNavigateToProfile={() => setCurrentPage('profile')}
          initialModule={activeModule}
          user={user}
        />
      );
    }

    // Employee gets basic dashboard
    return (
      <EmployeeDashboard 
        onLogout={handleLogout}
        onNavigateToProfile={() => setCurrentPage('profile')}
        initialModule={activeModule}
        user={user}
      />
    );
  }, [user, activeModule, handleLogout]);

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
          if (!user) {
            console.warn('Attempting to access dashboard without authentication');
            setCurrentPage('signin');
            return null;
          }
          
          return getDashboardComponent();
          
        case 'profile':
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
      return (
        <SigninPage 
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleLogin}
        />
      );
    }
  }, [currentPage, user, activeModule, handleLogin, handleSignupSuccess, handleLogout, handleModuleNavigation, getDashboardComponent]);

  return (
    <div className="App">
      {renderPage}
    </div>
  );
}

export default App;