import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import * as validate from '../people/validate';

import PersonDefault from '../../proptypes/PersonDefault';

class SignupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: { ...PersonDefault },
      givenNameError: false,
      givenNameHelperText: '',
      familyNameError: false,
      familyNameHelperText: '',
      usernameError: false,
      usernameHelperText: '',
      emailError: false,
      emailHelperText: '',
      passwordError: false,
      passwordHelperText: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFieldChange(event) {
    const { person } = this.state;
    const { name, value } = event.target;

    if (name === 'username' || name === 'email') {
      this.validateField(name, value.toLowerCase().trim());
      person[name] = value.toLowerCase().trim();
    } else {
      this.validateField(name, value.trim());
      person[name] = value.trim();
    }

    this.setState({ person });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    const { isUsernameAvailable, isEmailAvailable } = this.props;

    switch (name) {
      case 'username':
        if (!validate.username(value)) {
          fieldError.error = true;
          fieldError.helperText = 'A valid username of at least 6 characters is required!';
        } else {
          isUsernameAvailable(value).then().then(() => {
            this.setState({
              [`${name}Error`]: false,
              [`${name}HelperText`]: 'This is a good username!',
            });
          }).catch(() => {
            this.setState({
              [`${name}Error`]: true,
              [`${name}HelperText`]: 'Someone has already signed up using this username!',
            });
          });
        }
        break;
      case 'email':
        if (!validate.email(value)) {
          fieldError.error = true;
          fieldError.helperText = 'A valid email address is required!';
        } else {
          isEmailAvailable(value).then().then(() => {
            this.setState({
              [`${name}Error`]: false,
              [`${name}HelperText`]: 'This is a good email!',
            });
          }).catch(() => {
            this.setState({
              [`${name}Error`]: true,
              [`${name}HelperText`]: 'Someone has already signed up using this email!',
            });
          });
        }
        break;
      case 'givenName':
      case 'familyName':
        if (value.length < 3) {
          fieldError.error = true;
          fieldError.helperText = 'At least 3 characters are required!';
        }
        break;
      case 'password':
        if (!validate.password(value)) {
          fieldError.error = true;
          fieldError.helperText = 'A secure password is reuqired!';
        }
        break;
      default:
        if (value === '') {
          fieldError.error = true;
          fieldError.helperText = 'This field is required!';
        }
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });
  }

  canSubmit() {
    const fields = ['givenName', 'familyName', 'username', 'email', 'password'];

    const readyFields = fields.map((field) => {
      return this.state.person[field] !== '' && !this.state[`${field}Error`];
    });

    return !readyFields.includes(false);
  }

  signup() {
    const {
      person: {
        givenName,
        familyName,
        username,
        email,
        password,
      },
    } = this.state;

    const { signup } = this.props;

    signup({
      // givenName,
      // familyName,
      username,
      email,
      password,
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.signup();
  }

  render() {
    const {
      isFetching,
      success,
      error,
      isAuthenticated,
    } = this.props;

    const {
      person,
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      usernameError,
      usernameHelperText,
      emailHelperText,
      emailError,
      passwordError,
      passwordHelperText,
    } = this.state;

    if (isAuthenticated) {
      return (
        <Redirect push to="/dashboard/" />
      );
    }

    const canSubmit = this.canSubmit();

    return (
      <React.Fragment>
        <SignupForm
          givenName={person.givenName}
          givenNameError={givenNameError}
          givenNameHelperText={givenNameHelperText}
          familyName={person.familyName}
          familyNameError={familyNameError}
          familyNameHelperText={familyNameHelperText}
          username={person.username}
          usernameError={usernameError}
          usernameHelperText={usernameHelperText}
          email={person.email}
          emailError={emailError}
          emailHelperText={emailHelperText}
          password={person.password}
          passwordError={passwordError}
          passwordHelperText={passwordHelperText}
          handleFieldChange={this.handleFieldChange}
          handleFormSubmit={this.handleFormSubmit}
          isFetching={isFetching}
          success={success}
          error={error}
          canSubmit={canSubmit}
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
  }
}

SignupPage.propTypes = {
  signup: PropTypes.func.isRequired,
  isUsernameAvailable: PropTypes.func.isRequired,
  isEmailAvailable: PropTypes.func.isRequired,
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
    isUsernameAvailable: (username) => {
      return dispatch(actions.is.username(username));
    },
    isEmailAvailable: (email) => {
      return dispatch(actions.is.email(email));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupPage);
