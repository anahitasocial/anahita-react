/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import api from '../../api';
import actions from '../../actions';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const AuthToken = ({
  read,
  reset,
  alertSuccess,
  alertError,
  isAuthenticated,
  viewer,
  resetPassword = false,
}) => {
  const { token } = useParams();

  useEffect(() => {
    api.token.read(token)
      .then((result) => {
        console.log(result);
        alertSuccess('Welcome!');
        return read();
      }, () => {
        alertError(i18n.t('auth:prompts.errorTokenInvalid'));
      });

    return () => {
      reset();
    };
  }, [token]);

  if (isAuthenticated) {
    if (resetPassword) {
      return (
        <Navigate to={`/people/${viewer.alias}/settings/account/`} replace />
      );
    }

    return (
      <Navigate to={`/people/${viewer.alias}`} replace />
    );
  }

  return (<></>);
};

AuthToken.propTypes = {
  read: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
  resetPassword: PropTypes.bool,
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
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthToken);
