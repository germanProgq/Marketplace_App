import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000';

const ChangePriority = () => {
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState('email'); // Switch between email and username
  const [role, setRole] = useState('seller'); // Default role to seller
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const token = user?.token; // Get JWT token for authorization

  const clearAll = () => {
    setTimeout(() => {
        setMessage('')        
    }, 2200);
    setTarget('')
  }

  const handleGrantRole = async () => {
    if (!target) {
        setTimeout(() => {
            setMessage('')            
        }, 1400);
        setMessage('Please enter a user')
        return    
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.put(
        `${API}/grant-role`,
        {
          [targetType === 'email' ? 'email' : 'username']: target,
          role: role
        },
        config
      );

      if (response.status === 200) {        
        setMessage(`Role "${role}" granted successfully`);
        clearAll()
      } else {
        setMessage(`Failed to grant role "${role}"`);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || `An error occurred while granting role "${role}"`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{fontSize:'50px'}}>Grant Role</h3>
      <label style={{display:'flex', gap:'2vw', fontSize:'23px', alignItems:'center', justifyContent:'center', marginBottom:'20px'}}>
        Grant role by:
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
      <br/>
      <label style={{display:'flex', gap:'2vw', fontSize:'23px', alignItems:'center', justifyContent:'center', marginBottom:'3vh'}}>
        Select Role:
        <select onChange={(e) => setRole(e.target.value)} style={{color:'var(--primary)', border:'none', borderRadius:'12px', outline:'none'}}>
          <option value="advertised seller" style={{color:'inherit'}}>Advertised Seller</option>
          <option value="seller" style={{color:'inherit'}}>Seller</option>
          <option value="sponsor(1)" style={{color:'inherit'}}>Sponsor(1)</option>
          <option value="sponsor(2)" style={{color:'inherit'}}>Sponsor(2)</option>
        </select>
      </label>
      <button onClick={handleGrantRole}>Grant Role</button>
      <p>{message}</p>
    </div>
  );
};

export default ChangePriority;
