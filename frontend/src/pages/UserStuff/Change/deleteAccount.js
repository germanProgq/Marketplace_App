import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../Layout/assets/usercontext';
import { useNavigate } from 'react-router-dom';

const API = process.env.API || 'http://localhost:4000';

const DeleteAccount = () => {
  const { user, updateUser } = useUser(); // Get the current user and update function
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
      },
    };

    try {
      const response = await axios.delete(
        `${API}/user/delete-account`, // Backend endpoint for account deletion
        {
          data: { confirmationPassword }, // Pass the confirmation password
          ...config,
        }
      );

      if (response.status === 200) {
        setMessage('Account deleted successfully');
        updateUser(null); // Clear user data in context
        navigate('/'); // Redirect to a relevant page
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while deleting your account');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{color:'red', fontSize:'40px'}}>Delete Account</h3>
      <br/>
      <input
        type="password"
        value={confirmationPassword}
        onChange={(e) => setConfirmationPassword(e.target.value)}
        placeholder="Confirm your password"
        style={{ padding: '0.5em', borderRadius: '8px' }}
      />
      <button onClick={handleDeleteAccount} style={{ padding: '0.5em', borderRadius: '8px' }}>
        Delete Account
      </button>
      <p>{message}</p>
    </div>
  );
};

export default DeleteAccount;
