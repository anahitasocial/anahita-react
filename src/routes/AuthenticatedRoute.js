import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import LoginPage from '../containers/people/Login';

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
          <Route component={LoginPage} />
        );
      }}
    />
  );
};

AuthenticatedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

AuthenticatedRoute.defaultProps = {
  isAuthenticated: false,
};

function mapStateToProps(state) {
  const {
    isAuthenticated,
  } = state.authReducer;

  return {
    isAuthenticated,
  };
}

export default connect(mapStateToProps)(AuthenticatedRoute);
