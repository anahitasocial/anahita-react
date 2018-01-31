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
        username: '',
        hasUsername: true,
        password: '',
        hasPassword: true,
        error: ''
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  validate() {
    const { username, password } = this.state;
    this.setState({
        hasUsername: Boolean(username),
        hasPassword: Boolean(password)
    });
    return Boolean(username) && Boolean(password);
  }

  handleFieldChange = name => event => {
    this.setState({
      [name]: event.target.value,
      [`has_${name.charAt(0).toUpperCase()}!`]: Boolean(event.target.value),
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    if (this.validate()) {
      this.props.login({ username, password });
    }
  }

  render() {
    let {
        hasUsername,
        hasPassword
    } = this.state;

    const { isAuthenticated, errorMessage } = this.props;

    return (
      <div>
        <LoginForm
          handleFormSubmit={this.handleFormSubmit}
          handleFieldChange={this.handleFieldChange}
          hasUsername={hasUsername}
          hasPassword={hasPassword}
          error={errorMessage}
        />
        { isAuthenticated &&
            <Redirect push to="/dashboard" />
        }
      </div>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const {
    username,
    hasUsername,
    password,
    hasPassword,
    isAuthenticated,
    errorMessage
  } = state.authReducer;

  return {
    username,
    hasUsername,
    password,
    hasPassword,
    isAuthenticated,
    errorMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPage);
