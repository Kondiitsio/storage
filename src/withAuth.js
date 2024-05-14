import React from 'react';
import { Navigate } from 'react-router-dom';

function withAuth(Component) {
  return function ProtectedRoute(props) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
}

export default withAuth;