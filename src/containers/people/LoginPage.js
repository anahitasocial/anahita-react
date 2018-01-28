import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm';
import { auth } from '../../actions';

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
    const { actions } = this.props;
    if (this.validate()) {
      actions.login({ username, password });
    }
  }

  render() {
    let {
        hasUsername,
        hasPassword
    } = this.state;

    const { auth } = this.props;

    return (
      <div>
        <LoginForm
          handleFormSubmit={this.handleFormSubmit}
          handleFieldChange={this.handleFieldChange}
          hasUsername={hasUsername}
          hasPassword={hasPassword}
          error={auth.error}
        />
        { auth.isAuthenticated &&
            <Redirect push to="/dashboard" />
        }
      </div>
    );
  }
}

LoginPage.propTypes = {
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const {
    username,
    hasUsername,
    password,
    hasPassword,
    auth
  } = state;

  return {
    username,
    hasUsername,
    password,
    hasPassword,
    auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(auth, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPage);
