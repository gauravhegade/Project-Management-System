import React, { useState, useContext } from 'react';
import { login } from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role to 'student'
  const [error, setError] = useState('');
  const { login: loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!role) {
        throw new Error('Role is not defined');
      }
      const userData = await login({ email, password }, role);
      loginUser(userData);
      navigate('/dashboard');
      setError('');  // Clear error if login is successful
    } catch (err) {
      console.error('Login error:', err); // Log the error to the console
      setError(err.message || 'An unexpected error occurred');  // Display a user-friendly error message
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
