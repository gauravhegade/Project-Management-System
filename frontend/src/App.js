import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import StudentDashboard from './pages/StudentDashboard'; 
import FacultyDashboard from './pages/FacultyDashboard'; 

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
