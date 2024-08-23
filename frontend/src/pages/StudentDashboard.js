import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/api/subject/get-all-subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <p>You need to log in first.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Available Subjects</h2>
      <ul>
        {subjects.map((subject) => (
          <li key={subject._id}>
            <h3>{subject.course_name} - {subject.course_code}</h3>
            <p>{subject.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
