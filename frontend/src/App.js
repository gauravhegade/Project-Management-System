import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import Dashboard from './components/Dashboard';
import NotFoundPage from './pages/NotFound';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider


function App() {
  return (
    <AuthProvider> {/* Wrap entire app in AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
