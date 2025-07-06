// src/components/Common/PublicRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? <Navigate to="/my-profile" replace /> : children;
};

export default PublicRoute;
