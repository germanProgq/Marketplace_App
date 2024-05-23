// frontend/DeleteUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';
import { Navigate, useNavigate } from 'react-router-dom';
const API = process.env.API || 'http://localhost:4000'; // Adjust this to match your backend URL

const DeleteUser = () => {
  const [identifier, setIdentifier] = useState('');
  const [isEmail, setIsEmail] = useState(true); // Toggle between email and username
  const [message, setMessage] = useState('');
  const {user} = useUser()
  const navigate = useNavigate()
  const token = user?.token

  const handleDelete = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the Bearer token for authorization
      },
    };

    try {
      const response = await axios.delete(`${API}/user`, {
        data: isEmail ? { email: identifier } : { username: identifier },
        ...config,
      });

      if (response.status === 200) {
        setMessage('User deleted successfully');
        setTimeout(() => {
            navigate('/settings')            
        }, 220);        
      } else {
        setMessage('Failed to delete user');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while deleting the user');
    }
  };

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
      <h3 style={{fontSize:'50px', textAlign: 'center'}}>Delete User</h3>
      <div style={{display: 'inline-flex', flexDirection: 'column', gap: '10vh' }}>
        <label style={{display: 'flex', gap: '2vw', fontSize: '26px'}}>
            Delete by:
            <select style={{borderRadius:'30px', outline: 'none', color: 'var(--primary)', border:'none'}} onChange={(e) => setIsEmail(e.target.value === 'email')}>
            <option style={{color: 'inherit'}} value="email">Email</option>
            <option style={{color: 'inherit'}} value="username">Username</option>
            </select>
        </label>
        <input
            style={{padding: '1vh 1vw', borderRadius: '13px', border: 'none', outline: 'none', color: 'var(--primary)'}}
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={isEmail ? 'Enter email' : 'Enter username'}
        />
        <button onClick={handleDelete}>Delete User</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default DeleteUser;
