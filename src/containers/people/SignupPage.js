import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import SignupForm from '../../components/SignupForm';
import { signup } from '../../actions/auth';
import validate from './validate';

const styles = {
  root: {
    width: '100%',
  },
};

class SignupPage extends React.Component {
  constructor(props) {
    super(props);

    this.usernameField = React.createRef();

    this.state = {
      person: props.person,
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

    switch (name) {
      case 'username':
        if (!validate.username(value)) {
          fieldError.error = true;
          fieldError.helperText = 'A username of at least 6 characters is required!';
        }
        break;
      case 'email':
        if (!validate.email(value)) {
          fieldError.error = true;
          fieldError.helperText = 'A valid email address is required!';
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

    return !fieldError.error;
  }

  validate() {
    const {
      givenName,
      familyName,
      username,
      email,
      password,
    } = this.state.person;

    const givenNameValidated = this.validateField('givenName', givenName);
    const familyNameValidated = this.validateField('familyName', familyName);
    const usernameValidated = this.validateField('username', username);
    const emailValidated = this.validateField('email', email);
    const passwordValidated = this.validateField('password', password);

    return givenNameValidated &&
    familyNameValidated &&
    usernameValidated &&
    emailValidated &&
    passwordValidated;
  }

  signup() {
    const { person } = this.state;
    this.props.signup(person);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.signup();
    }
  }

  render() {
    const {
      classes,
      success,
      error,
      isFetching,
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

    return (
      <div className={classes.root}>
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
        />
        {isAuthenticated &&
          <Redirect push to="/dashboard/" />
        }
      </div>
    );
  }
}

SignupPage.propTypes = {
  classes: PropTypes.object.isRequired,
  signup: PropTypes.func.isRequired,
  person: PropTypes.object,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  isAuthenticated: PropTypes.bool,
};

SignupPage.defaultProps = {
  person: {
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    password: '',
  },
  isFetching: false,
  success: false,
  error: '',
  isAuthenticated: false,
};

const mapStateToProps = (state) => {
  const {
    error,
    success,
    isFetching,
    isAuthenticated,
  } = state.authReducer;

  return {
    error,
    success,
    isFetching,
    isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (person) => {
      dispatch(signup(person));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupPage));
