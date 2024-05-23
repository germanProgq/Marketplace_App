import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../Layout/assets/usercontext';
import { useNavigate } from 'react-router-dom';

const API = process.env.API || 'http://localhost:4000';

const ChangePassword = () => {
  const { user, updateUser } = useUser(); // Current user and context update function
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const clearAll = () => {
    setCurrentPassword('')
    setNewPassword('')
    setTimeout(() => {
      navigate('/login')      
    }, 700);
  }

  const handleChangePassword = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
      },
    };

    if (!currentPassword || !newPassword) {
      setMessage("Please enter both current and new passwords.");
      return;
    }

    try {
      const response = await axios.put(
        `${API}/user/change-password`, // Backend endpoint for changing password
        {
          currentPassword,
          newPassword,
        },
        config
      );

      if (response.status === 200) {
        setMessage("Password changed successfully.");

        // The user needs to re-authenticate, so clear the user context
        updateUser(null); // Log out the user
        clearAll()
      } else {
        setMessage("Failed to change password.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while changing your password.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2vw' }}>
      <h3 style={{fontSize:'50px',}}>Change Password</h3>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
        style={{ padding: '0.5em', borderRadius: '8px' }}
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        style={{ padding: '0.5em', borderRadius: '8px' }}
      />
      <br/>
      <button onClick={handleChangePassword} style={{ padding: '0.5em', borderRadius: '8px' }}>
        Change Password
      </button>
      <p>{message}</p> {/* Display success or error messages */}
    </div>
  );
};

export default ChangePassword;
