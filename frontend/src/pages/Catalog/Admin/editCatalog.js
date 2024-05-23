import React, { useState } from "react";
import { useUser } from "../../Layout/assets/usercontext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EditCatalog = () => {
    const navigate = useNavigate()
    const {user} = useUser()
    const [error, setError] = useState('')
    const API = process.env.API || 'http://localhost:4000'
    const token = user?.token
    const updateUsername = async () => {
        try {
          let newUsername = document.getElementById('name').value;
          if (!newUsername) {
            setError('Please enter a valid catalog id')
          }
          else {
            const response = await axios.delete(`${API}/catalog/${newUsername}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });      
          
          if (response.status === 200) {           
            setTimeout(() => {
                navigate('/settings')                
            }, 220);

            setError('Item Deleted');
            return response.data.message;
          } else {
            setError('Unexpected response status:', response.status);
            return { error: 'Unexpected response status' };
          }
        }
        } catch (error) {
          if (error.response) {
            console.error('Error deleting: ', error.response.data);
            return { error: error.response.data.message };
          } else if (error.request) {
            console.error('No response received:', error.request);
            return { error: 'No response from server' };
          } else {
            console.error('Request error:', error.message);
            return { error: 'Request error: ' + error.message };
          }
        }
        
      };
      
    return (
        <div className="change">
            <h4 className="what-to-change">Delete Catalog Item</h4>           
            <div className="form__group field">
                <input type="input" className="form__field" placeholder="Item ID" name="name" id='name' required />
                <label htmlFor="name" className="form__label">Item ID</label>                
            </div>
            {error}
            <button type="submit" onClick={updateUsername}>Confirm</button>
            <button><Link to={'/catalog/add'} style={{color: 'var(--primary)', textDecoration:'none'}}>Add Catalog Item</Link></button>
        </div>        
    )
}
export default EditCatalog