import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => {
    return state.session.isAuthenticated;
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticatedRoute;
