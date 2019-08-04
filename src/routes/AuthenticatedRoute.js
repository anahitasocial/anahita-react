import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import AuthPage from '../containers/auth';

const AuthenticatedRoute = ({
  component: Component,
  ...props
}) => {
  const { isAuthenticated } = props;
  return (
    <Route
      {...props}
      render={() => {
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Route component={AuthPage} />
        );
      }}
    />
  );
};

AuthenticatedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]).isRequired,
};

AuthenticatedRoute.defaultProps = {
  isAuthenticated: false,
};

function mapStateToProps(state) {
  const {
    isAuthenticated,
  } = state.auth;

  return {
    isAuthenticated,
  };
}

export default connect(mapStateToProps)(AuthenticatedRoute);
