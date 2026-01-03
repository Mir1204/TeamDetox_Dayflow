// import React, { useState } from 'react';
// import SignupPage from './pages/SignupPage';
// import SigninPage from './pages/SigninPage';
// import EmployeeDashboard from './pages/EmployeeDashboard';
// import AdminProfile from './pages/AdminProfile';

// function App() {
//   const [currentPage, setCurrentPage] = useState('signin'); // Start with signin page

//   const renderPage = () => {
//     switch(currentPage) {
//       case 'signup':
//         return <SignupPage onSwitchToSignin={() => setCurrentPage('signin')} />;
//       case 'dashboard':
//         return (
//           <EmployeeDashboard 
//             onLogout={() => setCurrentPage('signin')}
//             onSwitchToProfile={() => setCurrentPage('profile')}
//           />
//         );
//       case 'profile':
//         return <AdminProfile onBackToDashboard={() => setCurrentPage('dashboard')} />;
//       case 'signin':
//       default:
//         return (
//           <SigninPage 
//             onSwitchToSignup={() => setCurrentPage('signup')}
//             onLoginSuccess={() => setCurrentPage('dashboard')}
//           />
//         );
//     }
//   };

//   return (
//     <div className="App">
//       {renderPage()}
//     </div>
//   );
// }

// export default App;
import React from 'react';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  return (
    <div className="App">
      <EmployeeDashboard />
    </div>
  );
}

export default App;
