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
      person: {
        username: '',
        password: '',
      },
      hasUsername: true,
      hasPassword: true,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  validate() {
    const { username, password } = this.state.person;
    this.setState({
      hasUsername: Boolean(username),
      hasPassword: Boolean(password),
    });
    return Boolean(username) && Boolean(password);
  }

  handleFieldChange(event) {
    const { person } = this.state;
    const { name, value } = event.target;
    person[name] = value;
    this.setState({
      person,
      [`has${name.toUpperCase()}`]: Boolean(value),
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const { person } = this.state;
    if (this.validate()) {
      this.props.login(person);
    }
  }

  render() {
    const {
      hasUsername,
      hasPassword,
    } = this.state;

    const {
      isAuthenticated,
      error,
    } = this.props;

    const canSignup = true;

    return (
      <div>
        <LoginForm
          handleFormSubmit={this.handleFormSubmit}
          handleFieldChange={this.handleFieldChange}
          hasUsername={hasUsername}
          hasPassword={hasPassword}
          canSignup={canSignup}
          error={error}
        />
        {isAuthenticated &&
          <Redirect push to="/dashboard/" />
        }
      </div>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string,
};

LoginPage.defaultProps = {
  error: '',
  isAuthenticated: false,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    error,
  } = state.authReducer;

  return {
    isAuthenticated,
    error,
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
