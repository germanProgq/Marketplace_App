import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const API = process.env.API || 'http://localhost:4000'


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  });

  const navigate = useNavigate();
  let activityTimer = null; // Activity-based logout timer

  const updateUser = (newUser) => {
    if (newUser) {
      Cookies.set('user', JSON.stringify(newUser), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    } else {
      Cookies.remove('user');
    }
    setUser(newUser);
  };

  const resetActivityTimer = useCallback(() => {
    if (activityTimer) {
      clearTimeout(activityTimer);
    }

    activityTimer = setTimeout(() => {
      updateUser(null); // Log out user
      navigate('/login'); // Redirect to login
    }, 30 * 60 * 1000); // 30 minutes
  }, [navigate, updateUser]);

  const renewToken = useCallback(async () => {
    if (user?.refreshToken) {
      try {
        const response = await axios.post(`${API}/refresh-token`, {
          refreshToken: user.refreshToken,
        });

        if (response.status === 200) {
          const newToken = response.data.token;
          updateUser({
            ...user,
            token: newToken,
          });
        }
      } catch (error) {
        console.error('Error renewing token:', error);
        updateUser(null);
        navigate('/login');
      }
    }
  }, [user, updateUser, navigate]);

  useEffect(() => {
    if (user?.token) {
      const decodedToken = jwtDecode(user.token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      const renewBefore = 5 * 60 * 1000;

      if (expirationTime - currentTime < renewBefore) {
        renewToken(); 
      }

      const timeout = setTimeout(() => {
        updateUser(null); // Log out if token expires
        navigate('/login');
      }, expirationTime - currentTime); // Set timeout to log out on token expiration

      return () => clearTimeout(timeout);
    }
  }, [user, renewToken, updateUser, navigate]); // Dependency array

  useEffect(() => {
    window.addEventListener('mousemove', resetActivityTimer);
    window.addEventListener('keydown', resetActivityTimer);

    resetActivityTimer(); // Set initial activity timer

    return () => {
      window.removeEventListener('mousemove', resetActivityTimer);
      window.removeEventListener('keydown', resetActivityTimer);
      clearTimeout(activityTimer);
    };
  }, [resetActivityTimer]); // Dependency array

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
