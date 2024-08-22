import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  if (!user) {
    return <p>You need to log in first.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
