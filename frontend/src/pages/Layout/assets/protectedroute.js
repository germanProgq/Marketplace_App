import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './usercontext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const userRole = user.role      
      const isAllowed = allowedRoles.some((role) => role === userRole);

      if (!isAllowed) {
        navigate('/*');
      }
    }
  }, [user, navigate, allowedRoles]);

  return (
    <>
      {user && allowedRoles.some((role) => role === user.role)
        ? children
        : null}
    </>
  );
};

export default ProtectedRoute;
