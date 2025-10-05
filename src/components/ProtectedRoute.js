import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Protects routes by checking for a token in localStorage or auth state
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  const localToken = localStorage.getItem('token');
    console.log("ProtectedRoute - token from state:", token);
    console.log("ProtectedRoute - token from localStorage:", localToken);
  if (!token && !localToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
