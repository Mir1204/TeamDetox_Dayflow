import React, { useState, useEffect } from 'react';
import AdminProfile from './pages/AdminProfile';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('signin');
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('employees');

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('user');
    
    if (isLoggedIn && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('dashboard');
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setCurrentPage('signin');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'signup':
        return (
          <SignupPage 
            onSwitchToSignin={() => setCurrentPage('signin')}
            onSignupSuccess={handleSignupSuccess}
          />
        );
      case 'dashboard':
        return (
          <EmployeeDashboard 
            onLogout={handleLogout}
            onNavigateToProfile={() => setCurrentPage('profile')}
            initialModule={activeModule}
            user={user}
          />
        );
      case 'profile':
        return (
          <AdminProfile 
            onBackToDashboard={() => setCurrentPage('dashboard')}
            onLogout={handleLogout}
            onNavigateToModule={(module) => {
              setActiveModule(module);
              setCurrentPage('dashboard');
            }}
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
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;