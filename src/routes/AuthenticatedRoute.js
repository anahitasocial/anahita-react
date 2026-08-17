import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Progress from '../components/Progress';

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => {
    return state.session.isAuthenticated;
  });

  const isResolved = useSelector((state) => {
    return state.session.isResolved;
  });

  // App dispatches the session read on mount, but it resolves a tick
  // after the first render. Redirecting on the cached guess in the
  // meantime bounces a signed-in viewer to /auth on every reload, so
  // hold the route until the check settles.
  if (!isResolved) {
    return <Progress />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticatedRoute;
