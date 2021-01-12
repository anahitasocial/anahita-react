import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasswordResetForm from '../../components/auth/PasswordResetForm';
import * as actions from '../../actions';
import form from '../../utils/form';

const formFields = form.createFormFields(['email']);

const AuthPasswordReset = (props) => {
  const {
    reset,
    success,
    isFetching,
    error,
    alertError,
    alertSuccess,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('We emailed you a link. Please click on that link and follow the instructions!');
    }

    return () => {
      reset();
    };
  }, [error, success]);

  const handleOnChange = (event) => {
    const { target } = event;
    const trimmed = ['email'];
    const newFields = form.validateField(target, fields, trimmed);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      reset(formData);
    }
  };

  return (
    <PasswordResetForm
      handleOnSubmit={handleOnSubmit}
      handleOnChange={handleOnChange}
      fields={fields}
      error={error}
      success={success}
      isFetching={isFetching}
    />
  );
};

AuthPasswordReset.propTypes = {
  reset: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isFetching,
    success,
    error,
  } = state.password;

  return {
    isFetching,
    success,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reset: (person) => {
      dispatch(actions.password.reset(person));
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
)(AuthPasswordReset);
