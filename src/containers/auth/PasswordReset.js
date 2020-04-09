import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasswordResetForm from '../../components/auth/PasswordResetForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import form from '../../utils/forms';

const AuthPasswordReset = (props) => {
  const {
    reset,
    success,
    isFetching,
    error,
  } = props;

  const [fields, setFields] = useState({
    email: {
      value: '',
      isValid: false,
      error: '',
    },
  });

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
      const { email } = fields;
      reset(email.value);
    }
  };

  return (
    <React.Fragment>
      <PasswordResetForm
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        fields={fields}
        error={error}
        success={success}
        isFetching={isFetching}
      />
      {error &&
        <SimpleSnackbar
          isOpen={error !== ''}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={success}
          message="We emailed you a link. Please click on that link and follow the instructions!"
          type="success"
          autoHideDuration={null}
        />
      }
    </React.Fragment>
  );
};

AuthPasswordReset.propTypes = {
  reset: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthPasswordReset);
