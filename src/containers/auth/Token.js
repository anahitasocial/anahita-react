/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import api from '../../api';
import actions from '../../actions';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const AuthToken = (props) => {
  const {
    read,
    reset,
    alertSuccess,
    alertError,
    isAuthenticated,
    viewer,
    resetPassword,
    match: {
      params: {
        token,
      },
    },
  } = props;

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
        <Redirect push to={`/people/${viewer.alias}/settings/account/`} />
      );
    }

    return (
      <Redirect push to={`/people/${viewer.alias}`} />
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
