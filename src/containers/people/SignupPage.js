import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import SignupForm from '../../components/SignupForm';
import { signup } from '../../actions/auth';

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
      hasGivenName: true,
      hasFamilyName: true,
      hasUsername: true,
      hasEmail: true,
      hasPassword: true,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.person.id) {
      this.setState({
        person: Object.assign({}, nextProps.person),
      });
    }
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

  validate() {
    const { person } = this.state;
    this.setState({
      hasGivenName: Boolean(person.givenName),
      hasFamilyName: Boolean(person.familyName),
      hasUsername: Boolean(person.username),
      hasEmail: Boolean(person.email),
      hasPassword: Boolean(person.password),
    });

    return Boolean(person.givenName) &&
    Boolean(person.familyName) &&
    Boolean(person.username) &&
    Boolean(person.email) &&
    Boolean(person.password);
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
    } = this.props;

    const {
      person,
      hasGivenName,
      hasFamilyName,
      hasUsername,
      hasEmail,
      hasPassword,
    } = this.state;

    return (
      <div className={classes.root}>
        <SignupForm
          hasGivenName={hasGivenName}
          hasFamilyName={hasFamilyName}
          hasUsername={hasUsername}
          hasEmail={hasEmail}
          hasPassword={hasPassword}
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
        {success && person.id &&
          <Redirect to={`/people/${person.id}/`} />
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
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

SignupPage.defaultProps = {
  person: {
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    password: '',
  },
  success: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    error,
    success,
    isFetching,
  } = state.authReducer;

  return {
    error,
    success,
    isFetching,
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
