import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000';

const RevokeAdmin = () => {
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState('email'); // Email or username
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const token = user?.token;

  const clearAll = () => {
    setTimeout(() => {
        setMessage('')        
    }, 3000);
    setTarget('')
  }

  const handleRevokeAdmin = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer token for authorization
      },
    };

    try {
      const response = await axios.put(
        `${API}/user/revoke-admin`, // Endpoint to revoke admin privileges
        {
          [targetType === 'email' ? 'email' : 'username']: target, // Pass email or username
        },
        config
      );

      if (response.status === 200) {
        setMessage('Admin privileges revoked successfully');
        clearAll()
      } else {
        setMessage('Failed to revoke admin privileges');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while revoking admin privileges');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3>Revoke Admin Privileges</h3>
      <label style={{display:'flex', gap:'2vw', fontSize:'23px', alignItems:'center', justifyContent:'center'}}>
        Revoke admin by:
        <select onChange={(e) => setTargetType(e.target.value)} style={{color:'var(--primary)', border:'none', borderRadius:'12px', outline:'none'}}>
          <option value="email" style={{color:'inherit'}}>Email</option>
          <option value="username" style={{color:'inherit'}}>Username</option>
        </select>
      </label>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder={`Enter ${targetType}`}
      />
      <button onClick={handleRevokeAdmin}>Revoke Admin</button>
      <p>{message}</p>
    </div>
  );
};

export default RevokeAdmin;
