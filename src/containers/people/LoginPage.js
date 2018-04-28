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
      passwordError: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  validate() {
    const { username, password } = this.state.credentials;
    const usernameError = username === '';
    const passwordError = password === '';

    this.setState({
      usernameError,
      passwordError,
    });

    return !usernameError && !passwordError;
  }

  handleFieldChange(event) {
    const { credentials } = this.state;
    const { name, value } = event.target;
    credentials[name] = value.trim();
    this.setState({
      credentials,
      [`${name}Error`]: value === '',
    });
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
      passwordError,
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
          password={password}
          passwordError={passwordError}
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
