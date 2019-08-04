import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasswordResetForm from '../../components/auth/PasswordResetForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import actions from '../../actions/auth';
import * as validate from '../people/validate';

import PersonDefault from '../../proptypes/PersonDefault';

class PasswordResetPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: PersonDefault,
      emailError: false,
      emailHelperText: '',
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(event) {
    const { person } = this.state;
    const { name, value } = event.target;

    if (name === 'email') {
      this.validateField(name, value.toLowerCase().trim());
      person[name] = value.toLowerCase().trim();
    }

    this.setState({ person });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    if (!validate.email(value)) {
      fieldError.error = true;
      fieldError.helperText = 'A valid email address is required!';
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return !fieldError.error;
  }

  validate() {
    const { email } = this.state.person;
    const emailValidated = this.validateField('email', email);

    return emailValidated;
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const { person } = this.state;
    if (this.validate()) {
      const { resetPassword } = this.props;
      resetPassword(person);
    }
  }

  render() {
    const {
      isFetching,
      error,
      success,
    } = this.props;

    const {
      person,
      emailHelperText,
      emailError,
    } = this.state;

    return (
      <React.Fragment>
        <PasswordResetForm
          handleFormSubmit={this.handleFormSubmit}
          handleFieldChange={this.handleFieldChange}
          email={person.email}
          emailError={emailError}
          emailHelperText={emailHelperText}
          error={error}
          success={success}
          isFetching={isFetching}
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
            message="We emailed you a link. Please click on that link and follow the instructions!"
            type="success"
            autoHideDuration={null}
          />
        }
      </React.Fragment>
    );
  }
}

PasswordResetPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

PasswordResetPage.defaultProps = {
  isFetching: false,
  success: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    success,
    error,
    isFetching,
  } = state.auth;

  return {
    isFetching,
    success,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (person) => {
      dispatch(actions.resetPassword(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordResetPage);
