import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasswordResetForm from '../../components/auth/PasswordResetForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';

import PersonDefault from '../../proptypes/PersonDefault';

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValid()) {
      const { email } = fields;
      reset({
        ...PersonDefault,
        email: email.value,
      });
    }
  };

  return (
    <React.Fragment>
      <PasswordResetForm
        handleFormSubmit={handleSubmit}
        handleFieldChange={handleFieldChange}
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
