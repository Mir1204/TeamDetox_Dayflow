import React, { useState } from 'react';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <div className="App">
      <AdminProfile onBackToDashboard={() => console.log('Back clicked')} />
    </div>
  );
}

export default App;