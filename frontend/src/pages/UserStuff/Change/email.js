import React, { useState } from "react";
import { useUser } from "../../Layout/assets/usercontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './styles/change.css'

const API = process.env.API || 'http://localhost:4000'


const ChangeEmail = () => {
    const { user, updateUser } = useUser();
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()
    const clearAll = () => {
      setNewEmail('')
      navigate('/settings')      
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleChangeEmail = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      if (!newEmail && !emailRegex.test(newEmail)) {
        setMessage("Please enter a valid email.");
        return;
      }
  
      try {
        const response = await axios.put(
          `${API}/user/change-email`,
          {
            newEmail,
          },
          config
        );
  
        if (response.status === 200) {
          setMessage("Email changed successfully.");
          
          // Update user context with new email
          updateUser({
            ...user, // Keep existing user info
            email: newEmail, // Update the email
          });
          clearAll()
        } else {
          setMessage("Failed to change email.");
        }
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while changing your email.');
      }
    };
      
    return (
        <div className="change">
            <h4 className="what-to-change">Change Email</h4>
            <div className="current">Current e-mail: <p className="current-user">{user.email}</p></div>
            <div className="form__group field">
                <input type="input" className="form__field" placeholder="New email" name="name" id='name' required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <label htmlFor="name" className="form__label">New email</label>                
            </div>
            <p>{message}</p>
            <button type="submit" onClick={handleChangeEmail}>Confirm</button>
        </div>        
    )
}
export default ChangeEmail