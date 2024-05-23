// Contact.js
import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../assets/Loaders/loaders';
import './styles/root.css';
import './styles/contact.css';

const Contact = () => {
  const [loading, setLoading] = useState(false); // Add loading state

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API = process.env.API || 'http://localhost:4000';

  const axiosPostData = async () => {
    setLoading(true);
    const postData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      message: message,
    };
    try {
      const response = await axios.post(`${API}/contact`, postData);
      setSuccess(response.data);
      setTimeout(() => {
        setLoading(false); // Set loading to false after data is sent
      }, 3000);
      setTimeout(() => {
        setSuccess('')        
      }, 6000);
    } catch (error) {
      setError('Error sending message. Please try again.');
      setTimeout(() => {
        setError('');
        setLoading(false); // Set loading to false if there's an error
      }, 3000);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !message) {
      setError('Please fill in all fields.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      setError('');
      await axiosPostData();
      clearForm();
    }
  };

  const clearForm = () => {
    setEmail('');
    setMessage('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="contact-info">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="contact-info">
      <ul className="contact-buttons">
        <li>
          <a className="facebook contact-button" href="#">
            <span></span><span></span><span></span><span></span>
            <i className="fa fa-facebook" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a className="twitter contact-button" href="#">
            <span></span><span></span><span></span><span></span>
            <i className="fa fa-twitter" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a className="instagram contact-button" href="#">
            <span></span><span></span><span></span><span></span>
            <i className="fa fa-instagram" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a className="google contact-button" href="#">
            <span></span><span></span><span></span><span></span>
            <i className="fa fa-google-plus" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
      <div className="contact-form">
        <form className="message-form" onSubmit={handleContactSubmit}>
          <div className="contact-text">Contact Us</div>
          <div className="form-row">
            <div className="input-data">
              <input type="text" required autoComplete="name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <div className="underline"></div>
              <label htmlFor="">First Name</label>
            </div>
            <div className="input-data">
              <input type="text" required autoComplete="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <div className="underline"></div>
              <label htmlFor="">Last Name</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data">
              <input type="text" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="underline"></div>
              <label htmlFor="">Email Address</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data textarea">
              <textarea rows="8" cols="80" required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              <br />
              <div className="underline"></div>
              <label htmlFor="">Write your message</label>
              <br />
              {error && <p className="error">{error}</p>}
              {success && <p className="success-send">{success}</p>}
              <div className="form-row submit-btn">
                <div className="input-data">
                  <div className="inner"></div>
                  <input type="submit" value="Submit" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
        </>
      )}
    </div>
  );
};

export default Contact;
