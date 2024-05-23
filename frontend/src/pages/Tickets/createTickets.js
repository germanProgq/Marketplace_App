import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../Layout/assets/usercontext';
import { useNavigate } from 'react-router-dom';

const API = process.env.API || 'http://localhost:4000';

// Component to create a new support ticket
const CreateTicket = () => {
  const { user } = useUser(); // Current user context
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
      },
    };

    if (!subject || !description) {
      setMessage("Please enter both subject and description.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/tickets`, // Backend endpoint for creating a new ticket
        {
          subject,
          description,
        },
        config
      );

      if (response.status === 201) {
        setMessage("Ticket created successfully.");
        setSubject(''); // Clear input fields
        setDescription('');
        navigate('/user/tickets')
      } else {
        setMessage("Failed to create ticket.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while creating the ticket.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{fontSize:'50px'}}>Create a Support Ticket</h3>
      <div style={{display:'flex', flexDirection:'column', gap:'2vw', width:'40vw'}}>
        <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter ticket subject"
            style={{ padding: '0.5em', borderRadius: '8px' }}
        />
        <textarea
            value={description}
            onChange = {(e) => setDescription(e.target.value)}
            placeholder="Enter ticket description"
            style={{ padding: '0.5em', borderRadius: '8px', height: '4em' }}
        />
        <button onClick={handleSubmit} style={{ padding: '0.5em', borderRadius: '8px' }}>
            Submit Ticket
        </button>
      </div>
      <p>{message}</p> {/* Display success or error messages */}
    </div>
  );
};
export default CreateTicket