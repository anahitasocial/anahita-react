import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginForm from '../../components/auth/LoginForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      credentials: {
        username: '',
        password: '',
      },
      usernameError: false,
      usernameHelperText: '',
      passwordError: false,
      passwordHelperText: '',
      isNew: true,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  handleFieldChange(event) {
    const { credentials } = this.state;
    const { name, value } = event.target;

    this.validateField(name, value.trim());
    credentials[name] = value.trim();

    this.setState({ credentials });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    switch (name) {
      case 'username':
        if (value === '') {
          fieldError.error = true;
          fieldError.helperText = 'Please enter your email or username.';
        }
        break;
      case 'password':
        if (value === '') {
          fieldError.error = true;
          fieldError.helperText = 'Please enter your password.';
        }
        break;
      default:
        fieldError.error = false;
        fieldError.helperText = '';
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return !fieldError.error;
  }

  validate() {
    const {
      username,
      password,
    } = this.state.credentials;

    const usernameValidated = this.validateField('username', username);
    const passwordValidated = this.validateField('password', password);

    return usernameValidated && passwordValidated;
  }

  handleLogin(event) {
    event.preventDefault();
    const { credentials } = this.state;
    if (this.validate()) {
      const { login } = this.props;
      login(credentials);
    }
  }

  render() {
    const {
      usernameError,
      usernameHelperText,
      passwordError,
      passwordHelperText,
      credentials: {
        username,
        password,
      },
    } = this.state;

    const {
      isAuthenticated,
      isFetching,
      success,
      error,
    } = this.props;

    const canSignup = true;

    if (isAuthenticated && success) {
      return (
        <Redirect push to="/dashboard/" />
      );
    }

    return (
      <React.Fragment>
        <LoginForm
          handleLogin={this.handleLogin}
          handleFieldChange={this.handleFieldChange}
          username={username}
          usernameError={usernameError}
          usernameHelperText={usernameHelperText}
          password={password}
          passwordError={passwordError}
          passwordHelperText={passwordHelperText}
          canSignup={canSignup}
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
  }
}

LoginPage.propTypes = {
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
)(LoginPage);
