import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginForm from '../../components/auth/LoginForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import formFields from '../../formfields/login';
import form from '../../utils/forms';

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

  const handleOnChange = (event) => {
    const { target } = event;
    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const { username, password } = fields;
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
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
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
