import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';
import DownloadUserInfo from './downloadUserInfo';

const API = process.env.API || 'http://localhost:4000'

const GetUserInfo = () => {
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState('email'); // Email or username
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const token = user?.token; // JWT token for authorization

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
      <h3 style={{textAlign:'center', fontSize:'43px'}}>Get User Information</h3>
      <label style={{display:'flex', gap:'2vw', fontSize:'23px', alignItems:'center', justifyContent:'center'}}>
        Get user info by:
        <select onChange={(e) => setTargetType(e.target.value)} style={{color:'var(--primary)', border:'none', borderRadius:'12px', outline:'none', padding:'1vh 1vw'}}>
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
      <br/>
      <DownloadUserInfo target={target} targetType={targetType} token={token} /> {/* Add the download component */}
      <p>{message}</p>
    </div>
  );
};

export default GetUserInfo;
