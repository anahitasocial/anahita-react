/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import * as api from '../../api';
import * as actions from '../../actions';
import PersonType from '../../proptypes/Person';

const AuthToken = (props) => {
  const {
    read,
    reset,
    isAuthenticated,
    viewer,
    resetPassword,
    match: {
      params: {
        token,
      },
    },
  } = props;

  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    api.token.read(token)
      .then((result) => {
        console.log(result);
        setIsTokenValid(result.status === 202);
        return read();
      }, () => {
        setIsTokenValid(false);
      });

    return () => {
      reset();
    };
  }, [token, read, reset]);

  if (isAuthenticated) {
    if (resetPassword) {
      return (
        <Redirect push to={`/people/${viewer.alias}/settings/account/`} />
      );
    }

    return (
      <Redirect push to={`/people/${viewer.alias}`} />
    );
  }

  return (
    <Typography
      color={isTokenValid ? 'initial' : 'error'}
      align="center"
      component="h1"
      variant="body1"
    >
      {isTokenValid ? 'Welcome!' : 'This is an invalid Token!'}
    </Typography>
  );
};

AuthToken.propTypes = {
  read: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  resetPassword: PropTypes.bool,
};

AuthToken.defaultProps = {
  resetPassword: false,
};

const mapStateToProps = (state) => {
  const {
    viewer,
    isAuthenticated,
    success,
    error,
    isFetching,
  } = state.session;

  return {
    viewer,
    isAuthenticated,
    success,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => {
      return dispatch(actions.session.reset());
    },
    read: () => {
      return dispatch(actions.session.read());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthToken);
