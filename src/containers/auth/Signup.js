import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import * as api from '../../api';
import formFields from '../../formfields/signup';
import form from '../../utils/forms';

const AuthSignup = (props) => {
  const {
    signup,
    success,
    isFetching,
    error,
    isAuthenticated,
  } = props;

  const [fields, setFields] = useState(formFields);

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
            error: 'Username is already taken!',
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
            error: 'Email is already available in our system!',
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
      const {
        givenName,
        familyName,
        username,
        email,
        password,
      } = fields;

      signup({
        givenName: givenName.value,
        familyName: familyName.value,
        username: username.value,
        email: email.value,
        password: password.value,
      });
    }
  };

  if (isAuthenticated) {
    return (
      <Redirect push to="/dashboard/" />
    );
  }

  return (
    <React.Fragment>
      <SignupForm
        fields={fields}
        handleOnChange={handleOnChange}
        handleOnBlur={handleOnBlur}
        handleOnSubmit={handleOnSubmit}
        isFetching={isFetching}
        success={success}
        error={error}
      />
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Thank you! We just emailed you an account activation link. Please click on it and log on to your account."
          type="success"
          autoHideDuration={null}
        />
      }
    </React.Fragment>
  );
};

AuthSignup.propTypes = {
  signup: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthSignup);
