import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm';
import { login } from '../../actions/auth';

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
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
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
      status: false,
      helperText: '',
    };

    switch (name) {
      case 'username':
        if (value === '') {
          fieldError.status = true;
          fieldError.helperText = 'Please enter your email or username.';
        }
        break;
      case 'password':
        if (value === '') {
          fieldError.status = true;
          fieldError.helperText = 'Please enter your password.';
        }
        break;
      default:
        fieldError.status = true;
        fieldError.helperText = '';
    }

    this.setState({
      [`${name}Error`]: fieldError.status,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return fieldError.status;
  }

  validate() {
    const {
      username,
      password,
    } = this.state.credentials;

    const usernameError = this.validateField('username', username);
    const passwordError = this.validateField('password', password);

    return !(usernameError || passwordError);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const { credentials } = this.state;
    if (this.validate()) {
      this.props.login(credentials);
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

    return (
      <div>
        <LoginForm
          handleFormSubmit={this.handleFormSubmit}
          handleFieldChange={this.handleFieldChange}
          username={username}
          usernameError={usernameError}
          usernameHelperText={usernameHelperText}
          password={password}
          passwordError={passwordError}
          passwordHelperText={passwordHelperText}
          canSignup={canSignup}
          error={error}
          isFetching={isFetching}
        />
        {success && isAuthenticated &&
          <Redirect push to="/dashboard/" />
        }
      </div>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.string,
};

LoginPage.defaultProps = {
  error: '',
  success: false,
  isFetching: false,
  isAuthenticated: false,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    success,
    error,
    isFetching,
  } = state.authReducer;

  return {
    isAuthenticated,
    success,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPage);
