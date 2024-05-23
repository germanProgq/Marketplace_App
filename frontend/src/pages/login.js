import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { useUser } from "./Layout/assets/usercontext";
import { isMobile } from "react-device-detect";
import MobileLogIn from "./Mobile/mobileLogin";
import './styles/root.css';
import './styles/login.css';

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.API || 'http://localhost:4000';

  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleLogin = async () => {
    try {
      const postData = { username, password };
      const response = await axios.post(`${API_BASE_URL}/login`, postData);

      if (response.status === 200) {
        const token = response.data.token;
        const userResponse = await axios.get(`${API_BASE_URL}/user-info/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userResponse.data[0];
        const user = {
          username: userData.username,
          email: userData.email,
          role: userData.role,
          token,
        };

        updateUser(user);
        navigate("/");
      } else {
        setError("Login failed: unexpected status code.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed: " + (error.response?.data?.message || "Unexpected error"));
    }
  };

  const handleSignup = async () => {
    try {
      const postData = { username, password, email };
      const response = await axios.post(`${API_BASE_URL}/sign`, postData);

      if (response.status === 201) {
        await handleLogin();
      } else {
        setError("Signup failed: unexpected status code.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed: " + (error.response?.data?.message || "Unexpected error"));
    }
  };

  const HandleFormSubmit = (e) => {
    e.preventDefault();
    const isSignup = document.getElementById("chk").checked;

    if (!isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
    clearInputs();
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (isMobile) {
    return <MobileLogIn />;
  }

  return (
    <div className="contact-info-2">
      {error}
      <div className="contact-form-2">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form>
            <label className='form-label' htmlFor="chk" aria-hidden="true">Sign up</label>
            <input className='form-input' type="text" name="txt" placeholder="Username" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className='form-input' type="email" name="email" placeholder="Email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className='form-input' type="password" name="pswd" placeholder="Password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="submit-form-button" type="submit" onClick={HandleFormSubmit}>Sign up</button>
          </form>
        </div>
        <div className="login">
          <form>
            <label className='form-label' htmlFor="chk" aria-hidden="true">Login</label>
            <input className='form-input' type="text" name="email" placeholder="Username" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className='form-input' type="password" name="pswd" placeholder="Password" required autoComplete="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="submit-form-button" onClick={HandleFormSubmit} type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
