import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../assets/Loaders/loaders';
const API = process.env.API || 'http://localhost:4000';

const ImpersonateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const { user, updateUser } = useUser();
  const adminToken = user?.token;
  const navigate = useNavigate();

  const handleImpersonate = async () => {
    setLoading(true); // Set loading to true when impersonation starts

    const config = {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    };

    if (!username || !password) {
      setMessage("Please provide a username and password.");
      setLoading(false); // Set loading to false if input validation fails
      return;
    }

    try {
      const response = await axios.post(
        `${API}/admin/impersonate`, // Backend endpoint for impersonation
        {
          username,
          password,
        },
        config
      );

      if (response.status === 200) {
        const impersonationToken = response.data.token; // New token representing the impersonated user

        // Update the UserContext with the new token
        updateUser({
          ...user, // Keep existing user info
          token: impersonationToken, // Set the new token
          username: username, // Update username (or other user-specific data)
        });

        setMessage('Impersonation successful');
        navigate('/'); // Redirect to a relevant page after impersonation
      } else {
        setMessage('Failed to impersonate user');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred during impersonation');
    } finally {
      setLoading(false); // Set loading to false when impersonation completes (whether successful or not)
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{fontSize:'40px'}}>Impersonate a User</h3>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{ padding: '0.5em', borderRadius: '8px' }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ padding: '0.5em', borderRadius: '8px' }}
      />
      <button onClick={handleImpersonate} style={{ padding: '0.5em', borderRadius: '8px' }}>
        Impersonate User
      </button>
      {loading && <Loader />} {/* Conditionally render the loader */}
      <p>{message}</p>
    </div>
  );
};

export default ImpersonateUser;
