import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000'; // Your backend endpoint

const GrantAdmin = () => {
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState('email'); // Switch between email and username
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const token = user?.token; // Get JWT token for authorization

  const clearAll = () => {
    setTimeout(() => {
        setMessage('')        
    }, 2200);
    setTarget('')
  }

  const handleGrantAdmin = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include JWT token
      },
    };

    try {
      const response = await axios.put(
        `${API}/owner/grant-admin`, // The backend endpoint to grant admin
        {
          [targetType === 'email' ? 'email' : 'username']: target, // Pass email or username
        },
        config
      );

      if (response.status === 200) {        
        setMessage('Admin privileges granted successfully');
        clearAll()
      } else {
        setMessage('Failed to grant admin privileges');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while granting admin privileges');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{fontSize:'40px'}}>Grant Admin Privileges</h3>
      <label style={{display:'flex', gap:'2vw', fontSize:'23px', alignItems:'center', justifyContent:'center'}}>
        Grant admin by:
        <select onChange={(e) => setTargetType(e.target.value)} style={{color:'var(--primary)', border:'none', borderRadius:'12px', outline:'none'}}>
          <option value="email" style={{color:'inherit'}}>Email</option>
          <option value="username" style={{color:'inherit'}}>Username</option>
        </select>
      </label>
      <br/>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder={`Enter ${targetType}`}
      />
      <button onClick={handleGrantAdmin}>Grant Admin</button>
      <p>{message}</p>
    </div>
  );
};

export default GrantAdmin;
