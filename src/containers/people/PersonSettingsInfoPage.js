import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PersonInfoForm from '../../components/PersonInfoForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import { readActor } from '../../actions/actor';
import { editPerson } from '../../actions/person';
import { Person as PERSON } from '../../constants';

const styles = {
  root: {
    width: '100%',
  },
};

const BODY_CHARACTER_LIMIT = 350;

class PersonSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
      givenNameError: false,
      givenNameHelperText: '',
      familyNameError: false,
      familyNameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    const { actor } = this.props;
    if (!actor.id) {
      const { id } = this.props.match.params;
      this.props.readPerson(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.actor.id) {
      this.setState({
        actor: Object.assign({}, nextProps.actor),
      });
    }
  }

  handleFieldChange(event) {
    const { actor } = this.state;
    const { name, value } = event.target;

    this.validateField(name, value.trim());
    actor[name] = value;

    this.setState({ actor });
  }

  validateField(name, value) {
    const fieldError = {
      status: false,
      helperText: '',
    };

    switch (name) {
      case 'givenName':
      case 'familyName':
        if (value.length < 3) {
          fieldError.status = true;
          fieldError.helperText = 'At least 3 characters are required!';
        }
        break;
      case 'body':
        if (value.length > BODY_CHARACTER_LIMIT) {
          fieldError.status = true;
          fieldError.helperText = `You have exceeded the ${BODY_CHARACTER_LIMIT} character limit!`;
        }
        break;
      case 'gender':
        if (![PERSON.GENDER.FEMALE, PERSON.GENDER.MALE, PERSON.GENDER.NEUTRAL].includes(value)) {
          fieldError.status = true;
          fieldError.helperText = 'You must select a pronoun!';
        }
        break;
      default:
        fieldError.status = false;
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
      givenName,
      familyName,
      body,
    } = this.state.actor;

    const givenNameError = this.validateField('givenName', givenName);
    const familyNameError = this.validateField('familyName', familyName);
    const bodyError = this.validateField('body', body);

    return !(
      givenNameError ||
      familyNameError ||
      bodyError
    );
  }

  saveActor() {
    const { actor } = this.state;
    this.props.editPerson(actor);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.saveActor();
    }
  }

  canChangeUsertype() {
    const { actor, viewer } = this.props;

    if (viewer.id !== actor.id) {
      if ([PERSON.TYPE.ADMIN, PERSON.TYPE.SUPER_ADMIN].includes(viewer.usertype)) {
        return true;
      }
    }

    return false;
  }

  render() {
    const {
      classes,
      viewer,
      error,
      isFetching,
    } = this.props;

    const {
      actor,
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      bodyError,
      bodyHelperText,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor.id &&
          <ActorSettingCard
            namespace="people"
            actor={actor}
          >
            <PersonInfoForm
              givenName={actor.givenName}
              givenNameError={givenNameError}
              givenNameHelperText={givenNameHelperText}
              familyName={actor.familyName}
              familyNameError={familyNameError}
              familyNameHelperText={familyNameHelperText}
              body={actor.body}
              bodyError={bodyError}
              bodyHelperText={bodyHelperText}
              gender={actor.gender}
              usertype={actor.usertype}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              isFetching={isFetching}
              canChangeUsertype={this.canChangeUsertype()}
              isSuperAdmin={
                viewer.usertype === PERSON.TYPE.SUPER_ADMIN
              }
              error={error}
              dismissPath={`/people/${actor.id}/settings/`}
            />
          </ActorSettingCard>
        }
      </div>
    );
  }
}

PersonSettingsInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readPerson: PropTypes.func.isRequired,
  editPerson: PropTypes.func.isRequired,
  actor: PropTypes.object,
  viewer: PropTypes.object.isRequired,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

PersonSettingsInfoPage.defaultProps = {
  actor: {
    givenName: '',
    familyName: '',
    body: '',
    gender: PERSON.GENDER.NEUTRAL,
    usertype: PERSON.TYPE.REGISTERED,
  },
  success: false,
  isFetching: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    error,
  } = state.actorReducer;

  const {
    viewer,
  } = state.authReducer;

  return {
    actor,
    error,
    success,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(readActor(id, 'people'));
    },
    editPerson: (person) => {
      dispatch(editPerson(person));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfoPage));
