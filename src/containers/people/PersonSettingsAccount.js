import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonAccountForm from '../../components/PersonAccountForm';
import ActorSettingCard from '../../components/cards/ActorSetting';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import actions from '../../actions/person';
import * as validate from './validate';

import PersonType from '../../proptypes/Person';

const styles = (theme) => {
  return {
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  };
};

class PersonSettingsAccountPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {},
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

  componentWillMount() {
    const { id } = this.props.computedMatch.params;
    const { readPerson } = this.props;

    readPerson(id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      person: { ...nextProps.person },
    });
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
      username,
      email,
      password,
    } = this.state.person;

    const usernameValidated = this.validateField('username', username);
    const emailValidated = this.validateField('email', email);
    const passwordValidated = this.validateField('password', password);

    return usernameValidated &&
    emailValidated &&
    passwordValidated;
  }

  editPerson() {
    const { person } = this.state;
    this.props.editPersonAccount(person);
    delete person.password;
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.editPerson();
    }
  }

  render() {
    const {
      classes,
      isFetching,
      success,
      error,
    } = this.props;

    const {
      person,
      usernameHelperText,
      usernameError,
      emailHelperText,
      emailError,
      passwordError,
      passwordHelperText,
    } = this.state;

    return (
      <React.Fragment>
        {!person.id &&
          <CircularProgress className={classes.progress} />
        }
        {person.id &&
          <ActorSettingCard
            namespace="people"
            actor={person}
          >
            <PersonAccountForm
              usernameError={usernameError}
              usernameHelperText={usernameHelperText}
              emailError={emailError}
              emailHelperText={emailHelperText}
              passwordError={passwordError}
              passwordHelperText={passwordHelperText}
              username={person.username}
              email={person.email}
              password={person.password}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              dismissPath={`/people/${person.id}/settings/`}
              isFetching={isFetching}
              success={success}
              error={error}
            />
          </ActorSettingCard>
        }
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
            message="Account Updated!"
            type="success"
          />
        }
      </React.Fragment>
    );
  }
}

PersonSettingsAccountPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readPerson: PropTypes.func.isRequired,
  editPersonAccount: PropTypes.func.isRequired,
  person: PersonType,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  computedMatch: PropTypes.object.isRequired,
};

PersonSettingsAccountPage.defaultProps = {
  person: {},
  isFetching: false,
  success: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    person,
    isFetching,
    success,
    error,
  } = state.person;

  return {
    person,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(actions.read(id));
    },
    editPersonAccount: (person) => {
      dispatch(actions.editAccount(person));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsAccountPage));
