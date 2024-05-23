import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';
import GeneratePassword from '../../../../assets/generatePasswords';

const API = process.env.API || 'http://localhost:4000';

const UpdateUserInfo = () => {
  const [target, setTarget] = useState('');
  const [updateType, setUpdateType] = useState('email'); // Email or username
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const token = user?.token;

  const eraseAll = () => {
    if (updateType === 'email') {
        setTarget(newEmail)
    }
    else if (updateType === 'username') {
        setTarget(newUsername)
    }
    else {
        setTarget('')
    }
    setNewUsername('')
    setNewEmail('')
    setNewPassword('')    
    setTimeout(() => {
        setMessage('')        
    }, 3000);
  }

  const handleUpdate = async () => {
    if (!target) {
      setMessage("Target cannot be empty. Please enter an email or username.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.put(
        `${API}/user/update`,
        {
          targetEmail: updateType === 'email' ? target : undefined,
          targetUsername: updateType === 'username' ? target : undefined,
          newUsername: newUsername || undefined,
          newEmail: newEmail || undefined,
          newPassword: newPassword || undefined,
        },
        config
      );

      if (response.status === 200) {
        setMessage('User information updated successfully');
        eraseAll()
      } else {
        setMessage('Failed to update user');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while updating user information');
    }
  };


  return (
    <div style={{display:'flex', flexDirection:'row-reverse', justifyContent:'center', alignItems:'center', width:'100%'}}> 
        <GeneratePassword/>  
        <div style={{width: '80vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', gap:'1vh'} }>
        <h3 style={{fontSize:'50px'}}>Update User Information</h3>
        <br/>
        <label style={{display:'flex', gap:'2vw', fontSize:"23px"}}>
            Update by:
            <select onChange={(e) => setUpdateType(e.target.value)} style={{color:'var(--primary)', outline: 'none', borderRadius:'8px'}}>
            <option value="email" style={{color:'inherit'}}>Email</option>
            <option value="username" style={{color:"inherit"}}>Username</option>
            </select>
        </label>
        <br/>
        <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={`Enter ${updateType}`}
        />
            <div style={{display:'flex', flexDirection:'column', gap:'1vh'}}>
                <h4 style={{fontSize:'23px', textAlign:'center'}}>New Information</h4>
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New Username (optional)"
                    autoComplete='off'
                />
                <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="New Email (optional)"
                    autoComplete='off'
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password (optional)"
                    autoComplete='off'
                />
                <button onClick={handleUpdate}>Update User</button>
                <p>{message}</p>
            </div>
        </div>
    </div>
  );
};

export default UpdateUserInfo;
