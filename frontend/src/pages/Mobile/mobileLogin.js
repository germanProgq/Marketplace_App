import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from '../Layout/assets/usercontext';

const MobileLogIn = () => {
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isSignup = document.getElementById("reg-log").checked;

    if (isSignup) {
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

  return (
    <div className="mobile-container">
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In</span>
                  <span>Sign Up</span>
                </h6>
                <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                <label htmlFor="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-2-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Log In</h4>
                          <form onSubmit={handleFormSubmit}>
                            <div className="form-group-3">
                              <input
                                type="email"
                                name="logemail"
                                className="form-style-3"
                                placeholder="Your Email"
                                id="logemail"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <i className="input-icon uil uil-at"></i>
                            </div>
                            <div className="form-group-3 mt-2">
                              <input
                                type="password"
                                name="logpass"
                                className="form-style-3"
                                placeholder="Your Password"
                                id="logpass-2"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn mt-4">
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="card-2-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Sign Up</h4>
                          <form onSubmit={handleFormSubmit}>
                            <div className="form-group-3">
                              <input
                                type="text"
                                name="logname"
                                className="form-style-3"
                                placeholder="Username"
                                id="logname"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                            <div className="form-group-3 mt-2">
                              <input
                                type="email"
                                name="logemail"
                                className="form-style-3"
                                placeholder="E-mail"
                                id="logemail-signup"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <i className="input-icon uil uil-at"></i>
                            </div>
                            <div className="form-group-3 mt-2">
                              <input
                                type="password"
                                name="logpass"
                                className="form-style-3"
                                placeholder="Password"
                                id="logpass-2-signup"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn mt-4">
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogIn;
