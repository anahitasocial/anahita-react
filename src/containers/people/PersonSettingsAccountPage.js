import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PersonAccountForm from '../../components/PersonAccountForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import { readActor } from '../../actions/actor';
import { editPersonAccount } from '../../actions/person';
import {
  validateUsername,
  validateEmail,
} from '../../actions/auth';
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

    if (nextProps.actor.id) {
      this.setState({
        actor: Object.assign({}, nextProps.actor),
      });
    }
  }

  handleFieldChange(event) {
    const { actor } = this.state;
    const { name, value } = event.target;
    actor[name] = value.trim();
    this.setState({ actor });

    switch (name) {
      case 'username':
        if (validate.username(actor[name])) {
          this.props.isUsernameTaken(actor[name]);
        } else {
          this.setState({
            usernameHelperText: 'A valid username is required!',
            usernameError: true,
          });
        }
        break;
      case 'email':
        if (validate.email(actor[name])) {
          this.props.isEmailTaken(actor[name]);
        } else {
          this.setState({
            emailHelperText: 'A valid email address is required!',
            emailError: true,
          });
        }
        break;
      default:
        this.setState({
          [`${name}Error`]: value === '',
        });
    }
  }

  validate() {
    const {
      username,
      email,
      password,
    } = this.state.actor;

    const usernameError = !validate.username(username);
    const usernameHelperText = usernameError ? 'A valid username at least 6 characters is required!' : '';

    const emailError = !validate.email(email);
    const emailHelperText = emailError ? 'A valid email address is required!' : '';

    const passwordError = !validate.password(password);
    const passwordHelperText = passwordError ? 'A secure password of at least 6 characters is required!' : '';

    this.setState({
      usernameError,
      usernameHelperText,
      emailError,
      emailHelperText,
      passwordError,
      passwordHelperText,
    });

    return !(
      usernameError ||
      emailError ||
      passwordError
    );
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
  isUsernameTaken: PropTypes.func.isRequired,
  isEmailTaken: PropTypes.func.isRequired,
  usernameAvailable: PropTypes.bool.isRequired,
  emailAvailable: PropTypes.bool.isRequired,
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
    success,
    error,
    isFetching,
  } = state.actorReducer;

  const {
    viewer,
    usernameAvailable,
    emailAvailable,
  } = state.authReducer;

  return {
    actor,
    error,
    success,
    isFetching,
    viewer,
    usernameAvailable,
    emailAvailable,
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
)(PersonSettingsInfoPage));
