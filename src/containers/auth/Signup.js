import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import actions from '../../actions';
import api from '../../api';
import form from '../../utils/form';
import i18n from '../../languages';

const formFields = form.createFormFields([
  'givenName',
  'familyName',
  'username',
  'email',
  'password',
]);

const AuthSignup = (props) => {
  const {
    signup,
    success,
    isFetching,
    error,
    isAuthenticated,
    alertError,
    alertSuccess,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('auth:prompts.error'));
    }

    if (success) {
      alertSuccess(i18n.t('auth:prompts.signupEmailSuccess'));
    }
  }, [error, success]);

  const handleOnChange = (event) => {
    const { target } = event;
    const trimmed = ['username', 'password', 'email'];
    const newFields = form.validateField(target, fields, trimmed);

    setFields({ ...newFields });
  };

  const handleOnBlur = (event) => {
    event.preventDefault();

    const { target } = event;
    const { name, value } = target;

    if (name === 'username' && fields.username.isValid) {
      api.is.username(value).catch(() => {
        setFields({
          ...fields,
          username: {
            ...fields.username,
            isValid: false,
            error: i18n.t('auth:prompts.errorSignupUsernameTaken'),
          },
        });
      });
    }

    if (name === 'email' && fields.email.isValid) {
      api.is.email(value).catch(() => {
        setFields({
          ...fields,
          email: {
            ...fields.email,
            isValid: false,
            error: i18n.t('auth:prompts.errorSignupEmailTaken'),
          },
        });
      });
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      signup(formData);
    }
  };

  if (isAuthenticated) {
    return (
      <Redirect push to="/dashboard/" />
    );
  }

  return (
    <SignupForm
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnBlur={handleOnBlur}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
      success={success}
      error={error}
    />
  );
};

AuthSignup.propTypes = {
  signup: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isFetching,
    success,
    error,
  } = state.signup;

  const {
    isAuthenticated,
  } = state.session;

  return {
    isAuthenticated,
    isFetching,
    success,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (person) => {
      return dispatch(actions.signup.add(person));
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
)(AuthSignup);
