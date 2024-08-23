// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const FacultyDashboard = () => {
//   const { user } = useContext(AuthContext); // Access the logged-in user (faculty)
  
//   // State for fetching and displaying subjects
//   const [subjects, setSubjects] = useState([]);
  
//   // State for creating a new subject
//   const [subjectData, setSubjectData] = useState({
//     course_code: '',
//     course_name: '',
//     faculty_incharge_name: '',
//     faculty_incharge_email: user?.email || '', // Get faculty email from AuthContext
//     max_team_size: '',
//     min_team_size: '',
//     description: '',
//     last_date: '',
//   });

//   // Function to fetch the list of subjects
//   const fetchSubjects = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/subject/get-list-of-subjects', {
//         params: { faculty_incharge_email: user.email },
//       });
//       setSubjects(response.data);
//     } catch (error) {
//       console.error('Error fetching subjects:', error.response?.data || error.message);
//     }
//   };

//   // Fetch the list of subjects on component mount
//   useEffect(() => {
//     if (user && user.email) {
//       fetchSubjects();
//     }
//   }, [user]);

//   // Handle input change for the create subject form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSubjectData({ ...subjectData, [name]: value });
//   };

//   // Handle subject creation submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/api/subject/create-subject', subjectData);
//       alert('Subject created successfully');
      
//       setSubjectData({
//         course_code: '',
//         course_name: '',
//         faculty_incharge_name: '',
//         faculty_incharge_email: user.email || '',
//         max_team_size: '',
//         min_team_size: '',
//         description: '',
//         last_date: '',
//       });
//       // Fetch the updated list of subjects after creation
//       fetchSubjects();
//     } catch (error) {
//       console.error('Error creating subject:', error.response?.data || error.message);
//       alert(`Failed to create subject: ${error.response?.data.error || error.message}`);
//     }
//   };

//   // Handle Modify Subject button click
//   const handleModify = (subject) => {
//     console.log('Modify subject:', subject);
//     // Implement modify functionality (e.g., open a modal for editing)
//   };

//   // Handle View Details button click
//   const handleViewDetails = (subject) => {
//     console.log('View details for subject:', subject);
//     // Implement view details functionality (e.g., open a modal for details)
//   };

//   if (!user) {
//     return <p>You need to log in first.</p>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {user.email}</h1>

//       <h2>Create a Subject</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="course_code"
//           placeholder="Course Code"
//           value={subjectData.course_code}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="text"
//           name="course_name"
//           placeholder="Course Name"
//           value={subjectData.course_name}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="text"
//           name="faculty_incharge_name"
//           placeholder="Faculty In-charge Name"
//           value={subjectData.faculty_incharge_name}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="email"
//           name="faculty_incharge_email"
//           placeholder="Faculty In-charge Email"
//           value={subjectData.faculty_incharge_email}
//           onChange={handleInputChange}
//           disabled // This field is auto-filled from the AuthContext
//         />
//         <input
//           type="number"
//           name="max_team_size"
//           placeholder="Max Team Size"
//           value={subjectData.max_team_size}
//           onChange={handleInputChange}
//         />
//         <input
//           type="number"
//           name="min_team_size"
//           placeholder="Min Team Size"
//           value={subjectData.min_team_size}
//           onChange={handleInputChange}
//         />
//         <textarea
//           name="description"
//           placeholder="Subject Description"
//           value={subjectData.description}
//           onChange={handleInputChange}
//         />
//         <input
//           type="date"
//           name="last_date"
//           placeholder="Last Date"
//           value={subjectData.last_date}
//           onChange={handleInputChange}
//         />
//         <button type="submit">Create Subject</button>
//       </form>

//       <h2>Your Subjects</h2>
//       {subjects.length === 0 ? (
//         <div>
//           <p>No subjects found for you.</p>
//           <p>Consider creating a new subject using the form above.</p>
//         </div>
//       ) : (
//         subjects.map((subject) => (
//           <div key={subject._id} style={{ marginBottom: '20px' }}>
//             <h3>{subject.course_name}</h3>
//             <button onClick={() => handleModify(subject)}>Modify Subject</button>
//             <button onClick={() => handleViewDetails(subject)}>View Details</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default FacultyDashboard;
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext); // Access the logged-in user (faculty)
  
  // State for fetching and displaying subjects
  const [subjects, setSubjects] = useState([]);
  
  // State for creating a new subject
  const [subjectData, setSubjectData] = useState({
    course_code: '',
    course_name: '',
    faculty_incharge_name: '',
    faculty_incharge_email: user?.email || '', // Get faculty email from AuthContext
    max_team_size: '',
    min_team_size: '',
    description: '',
    last_date: '',
  });

  // State for selected subject to view details
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  // Function to fetch the list of subjects
  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subject/get-list-of-subjects', {
        params: { faculty_incharge_email: user.email },
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error.response?.data || error.message);
    }
  };

  // Fetch the list of subjects on component mount
  useEffect(() => {
    if (user && user.email) {
      fetchSubjects();
    }
  }, [user]);

  // Handle input change for the create subject form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData({ ...subjectData, [name]: value });
  };

  // Handle subject creation submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/subject/create-subject', subjectData);
      alert('Subject created successfully');
      
      setSubjectData({
        course_code: '',
        course_name: '',
        faculty_incharge_name: '',
        faculty_incharge_email: user.email || '',
        max_team_size: '',
        min_team_size: '',
        description: '',
        last_date: '',
      });
      // Fetch the updated list of subjects after creation
      fetchSubjects();
    } catch (error) {
      console.error('Error creating subject:', error.response?.data || error.message);
      alert(`Failed to create subject: ${error.response?.data.error || error.message}`);
    }
  };

  // Handle Modify Subject button click
  const handleModify = (subject) => {
    console.log('Modify subject:', subject);
    // Implement modify functionality (e.g., open a modal for editing)
  };

  // Handle View Details button click
  const handleViewDetails = (subject) => {
    setSelectedSubject(subject); // Set the selected subject for detailed view
    setShowModal(true); // Show the modal with details
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedSubject(null); // Clear selected subject
  };

  if (!user) {
    return <p>You need to log in first.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>

      <h2>Create a Subject</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="course_code"
          placeholder="Course Code"
          value={subjectData.course_code}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="course_name"
          placeholder="Course Name"
          value={subjectData.course_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="faculty_incharge_name"
          placeholder="Faculty In-charge Name"
          value={subjectData.faculty_incharge_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="faculty_incharge_email"
          placeholder="Faculty In-charge Email"
          value={subjectData.faculty_incharge_email}
          onChange={handleInputChange}
          disabled // This field is auto-filled from the AuthContext
        />
        <input
          type="number"
          name="max_team_size"
          placeholder="Max Team Size"
          value={subjectData.max_team_size}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="min_team_size"
          placeholder="Min Team Size"
          value={subjectData.min_team_size}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Subject Description"
          value={subjectData.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="last_date"
          placeholder="Last Date"
          value={subjectData.last_date}
          onChange={handleInputChange}
        />
        <button type="submit">Create Subject</button>
      </form>

      <h2>Your Subjects</h2>
      {subjects.length === 0 ? (
        <div>
          <p>No subjects found for you.</p>
          <p>Consider creating a new subject using the form above.</p>
        </div>
      ) : (
        subjects.map((subject) => (
          <div key={subject._id} style={{ marginBottom: '20px' }}>
            <h3>{subject.course_name}</h3>
            <button onClick={() => handleModify(subject)}>Modify Subject</button>
            <button onClick={() => handleViewDetails(subject)}>View Details</button>
          </div>
        ))
      )}

      {/* Modal for displaying detailed information */}
      {showModal && selectedSubject && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedSubject.course_name}</h2>
            <p><strong>Course Code:</strong> {selectedSubject.course_code}</p>
            <p><strong>Description:</strong> {selectedSubject.description}</p>
            <p><strong>Last Date:</strong> {new Date(selectedSubject.last_date).toLocaleDateString()}</p>
            
            {/* Display groups, members, and phases */}
            {selectedSubject.groups && selectedSubject.groups.length > 0 ? (
              selectedSubject.groups.map((group, index) => (
                <div key={index}>
                  <h4>Group {group.group_no}: {group.title}</h4>
                  <p><strong>Project Description:</strong> {group.project_description}</p>
                  
                  <h5>Members:</h5>
                  <ul>
                    {group.members.map((member, idx) => (
                      <li key={idx}>{member.name} ({member.email}) - {member.usn}</li>
                    ))}
                  </ul>

                  <h5>Phases:</h5>
                  {group.phases.map((phase, idx) => (
                    <div key={idx}>
                      <p><strong>Phase {phase.phase_no}:</strong> {phase.phase_name}</p>
                      <h6>Files:</h6>
                      <ul>
                        {phase.files.map((file, idx) => (
                          <li key={idx}>{file.file_name} (Uploaded at {new Date(file.uploadedAt).toLocaleString()})</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No groups available.</p>
            )}

            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
