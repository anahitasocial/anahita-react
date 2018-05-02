import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PersonAccountForm from '../../components/PersonAccountForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import { readActor } from '../../actions/actor';
import { editPersonAccount } from '../../actions/person';
import validate from './validate';

const styles = {
  root: {
    width: '100%',
  },
};

class PersonSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
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
    const { actor } = this.props;
    if (!actor.id) {
      const { id } = this.props.match.params;
      this.props.readActor(id, 'people');
    }
  }

  handleFieldChange(event) {
    const { actor } = this.state;
    const { name, value } = event.target;

    if (name === 'username' || name === 'email') {
      this.validateField(name, value.toLowerCase().trim());
      actor[name] = value.toLowerCase().trim();
    } else {
      this.validateField(name, value.trim());
      actor[name] = value.trim();
    }

    this.setState({ actor });
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
    } = this.state.actor;

    const usernameValidated = this.validateField('username', username);
    const emailValidated = this.validateField('email', email);
    const passwordValidated = this.validateField('password', password);

    return usernameValidated &&
    emailValidated &&
    passwordValidated;
  }

  saveActor() {
    const { actor } = this.state;
    this.props.editPersonAccount(actor);
    delete actor.password;
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.saveActor();
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
      actor,
      usernameHelperText,
      usernameError,
      emailHelperText,
      emailError,
      passwordError,
      passwordHelperText,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor.id &&
          <ActorSettingCard
            namespace="people"
            actor={actor}
          >
            <PersonAccountForm
              usernameError={usernameError}
              usernameHelperText={usernameHelperText}
              emailError={emailError}
              emailHelperText={emailHelperText}
              passwordError={passwordError}
              passwordHelperText={passwordHelperText}
              username={actor.username}
              email={actor.email}
              password={actor.password}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              dismissPath={`/people/${actor.id}/settings/`}
              isFetching={isFetching}
              success={success}
              error={error}
            />
          </ActorSettingCard>
        }
      </div>
    );
  }
}

PersonSettingsInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  editPersonAccount: PropTypes.func.isRequired,
  actor: PropTypes.object,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

PersonSettingsInfoPage.defaultProps = {
  actor: {
    email: '',
    username: '',
    password: '',
  },
  isFetching: false,
  success: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actor,
  } = state.actorReducer;

  const {
    isFetching,
    success,
    error,
  } = state.personReducer;

  const {
    viewer,
  } = state.authReducer;

  return {
    actor,
    error,
    success,
    isFetching,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(readActor(id, namespace));
    },
    editPersonAccount: (person) => {
      dispatch(editPersonAccount(person));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfoPage));
