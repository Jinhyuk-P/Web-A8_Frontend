import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  // Check localStorage on startup so auth persists after page refresh
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;