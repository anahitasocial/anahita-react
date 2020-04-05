import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginForm from '../../components/auth/LoginForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import formFields from '../../formfields/login';

const AuthLogin = (props) => {
  const {
    login,
    reset,
    isAuthenticated,
    isFetching,
    success,
    error,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const handleFieldChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    setFields({
      ...fields,
      [name]: {
        value: value.trim(),
        isValid: target.willValidate && target.checkValidity(),
        error: target.validationMessage,
      },
    });
  };

  const isValid = () => {
    const keys = Object.keys(fields);
    return keys.filter((f) => {
      return f.isValid === false;
    }).length === 0;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const { username, password } = fields;
    if (isValid) {
      login({
        username: username.value,
        password: password.value,
      });
    }
  };

  if (isAuthenticated && success) {
    return (
      <Redirect push to="/dashboard/" />
    );
  }

  return (
    <React.Fragment>
      <LoginForm
        handleLogin={handleLogin}
        handleFieldChange={handleFieldChange}
        fields={fields}
        canSignup
        isFetching={isFetching}
      />
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Authentication failed! Please check your username and password!"
          type="error"
        />
      }
    </React.Fragment>
  );
};

AuthLogin.propTypes = {
  login: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    success,
    error,
    isFetching,
  } = state.session;

  return {
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
    login: (credentials) => {
      return dispatch(actions.session.add(credentials));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLogin);
