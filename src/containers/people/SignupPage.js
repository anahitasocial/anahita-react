import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import SignupForm from '../../components/SignupForm';
import {
  signup,
  validateUsername,
  validateEmail,
} from '../../actions/auth';
import validate from './validate';

const styles = {
  root: {
    width: '100%',
  },
};

class SignupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: props.person,
      givenNameError: false,
      familyNameError: false,
      usernameError: false,
      usernameHelperText: '',
      emailError: false,
      emailHelperText: '',
      passwordError: false,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      usernameAvailable,
      emailAvailable,
    } = nextProps;

    this.setState({
      usernameError: !usernameAvailable,
      usernameHelperText: usernameAvailable ? 'Good username!' : 'Username already taken!',
      emailError: !emailAvailable,
      emailHelperText: emailAvailable ? 'Good email!' : 'Email already taken!',
    });
  }

  handleFieldChange(event) {
    const { person } = this.state;
    const { name, value } = event.target;
    person[name] = value.trim();
    this.setState({ person });

    switch (name) {
      case 'username':
        if (validate.username(person[name])) {
          this.props.isUsernameTaken(person[name]);
        } else {
          this.setState({
            usernameHelperText: 'A valid username is required!',
            usernameError: true,
          });
        }
        break;
      case 'email':
        if (validate.email(person[name])) {
          this.props.isEmailTaken(person[name]);
        } else {
          this.setState({
            emailHelperText: 'A valid email address is required!',
            emailError: true,
          });
        }
        break;
      case 'password':
        this.setState({
          passwordError: !validate.password(person[name]),
        });
        break;
      default:
        this.setState({
          [`${name}Error`]: value === '',
        });
    }
  }

  validate() {
    const {
      givenName,
      familyName,
      username,
      email,
      password,
    } = this.state.person;

    const givenNameError = givenName.length < 3;
    const familyNameError = familyName.length < 3;

    const usernameError = !validate.username(username);
    const usernameHelperText = usernameError ? 'A valid username is required!' : '';

    const emailError = !validate.email(email);
    const emailHelperText = emailError ? 'A valid email address is required!' : '';

    const passwordError = !validate.password(password);

    this.setState({
      givenNameError,
      familyNameError,
      usernameError,
      usernameHelperText,
      emailError,
      emailHelperText,
      passwordError,
    });

    return !(
      givenNameError ||
      familyNameError ||
      usernameError ||
      emailError ||
      passwordError
    );
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
      familyNameError,
      usernameHelperText,
      usernameError,
      emailHelperText,
      emailError,
      passwordError,
    } = this.state;

    return (
      <div className={classes.root}>
        <SignupForm
          givenNameError={givenNameError}
          familyNameError={familyNameError}
          usernameError={usernameError}
          usernameHelperText={usernameHelperText}
          emailError={emailError}
          emailHelperText={emailHelperText}
          passwordError={passwordError}
          givenName={person.givenName}
          familyName={person.familyName}
          username={person.username}
          email={person.email}
          password={person.password}
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
  isUsernameTaken: PropTypes.func.isRequired,
  isEmailTaken: PropTypes.func.isRequired,
  person: PropTypes.object,
  success: PropTypes.bool,
  usernameAvailable: PropTypes.bool.isRequired,
  emailAvailable: PropTypes.bool.isRequired,
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
    usernameAvailable,
    emailAvailable,
  } = state.authReducer;

  return {
    error,
    success,
    isFetching,
    isAuthenticated,
    usernameAvailable,
    emailAvailable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (person) => {
      dispatch(signup(person));
    },
    isUsernameTaken: (username) => {
      dispatch(validateUsername(username));
    },
    isEmailTaken: (email) => {
      dispatch(validateEmail(email));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupPage));
