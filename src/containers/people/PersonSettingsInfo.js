import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonInfoForm from '../../components/PersonInfoForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import {
  readPerson,
  editPerson,
} from '../../actions/person';
import { Person as PERSON } from '../../constants';

const styles = theme => ({
  progress: {
    marginLeft: '48%',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

const BODY_CHARACTER_LIMIT = 1000;

class PersonSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {},
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
    const { id } = this.props.computedMatch.params;
    this.props.readPerson(id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      person: Object.assign({}, nextProps.person),
    });
  }

  handleFieldChange(event) {
    const { person } = this.state;
    const { name, value } = event.target;

    this.validateField(name, value.trim());
    person[name] = value;

    this.setState({ person });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    switch (name) {
      case 'givenName':
      case 'familyName':
        if (value.length < 3) {
          fieldError.error = true;
          fieldError.helperText = 'At least 3 characters are required!';
        }
        break;
      case 'body':
        if (value && value.length > BODY_CHARACTER_LIMIT) {
          fieldError.error = true;
          fieldError.helperText = `You have exceeded the ${BODY_CHARACTER_LIMIT} character limit!`;
        }
        break;
      case 'gender':
        if (![
          PERSON.GENDER.FEMALE,
          PERSON.GENDER.MALE,
          PERSON.GENDER.NEUTRAL,
        ].includes(value)) {
          fieldError.error = true;
          fieldError.helperText = 'You must select a pronoun!';
        }
        break;
      case 'usertype':
        if (![
          PERSON.TYPE.REGISTERED,
          PERSON.TYPE.ADMIN,
          PERSON.TYPE.SUPER_ADMIN,
        ].includes(value)) {
          fieldError.error = true;
          fieldError.helperText = 'Invalid user type!';
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
      givenName,
      familyName,
      body,
      gender,
      usertype,
    } = this.state.person;

    const givenNameValidated = this.validateField('givenName', givenName);
    const familyNameValidated = this.validateField('familyName', familyName);
    const bodyValidated = this.validateField('body', body);
    const genderValidated = this.validateField('gender', gender);
    const usertypeValidated = this.validateField('usertype', usertype);

    return givenNameValidated &&
    familyNameValidated &&
    bodyValidated &&
    genderValidated &&
    usertypeValidated;
  }

  editPerson() {
    const { person } = this.state;
    this.props.editPerson(person);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.editPerson();
    }
  }

  canChangeUsertype() {
    const { person, viewer } = this.props;

    if (viewer.id !== person.id) {
      if ([
        PERSON.TYPE.ADMIN,
        PERSON.TYPE.SUPER_ADMIN,
      ].includes(viewer.usertype)) {
        return true;
      }
    }

    return false;
  }

  render() {
    const {
      classes,
      viewer,
      isFetching,
      success,
      error,
    } = this.props;

    const {
      person,
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      bodyError,
      bodyHelperText,
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
            key="com:people.person"
          >
            <PersonInfoForm
              givenName={person.givenName}
              givenNameError={givenNameError}
              givenNameHelperText={givenNameHelperText}
              familyName={person.familyName}
              familyNameError={familyNameError}
              familyNameHelperText={familyNameHelperText}
              body={person.body}
              bodyError={bodyError}
              bodyHelperText={bodyHelperText}
              gender={person.gender}
              usertype={person.usertype}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              isFetching={isFetching}
              canChangeUsertype={this.canChangeUsertype()}
              isSuperAdmin={
                viewer.usertype === PERSON.TYPE.SUPER_ADMIN
              }
              dismissPath={`/people/${person.id}/settings/`}
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
            message="Information Updated!"
            type="success"
          />
        }
      </React.Fragment>
    );
  }
}

PersonSettingsInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readPerson: PropTypes.func.isRequired,
  editPerson: PropTypes.func.isRequired,
  person: PropTypes.object,
  viewer: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.bool,
  computedMatch: PropTypes.object.isRequired,
};

PersonSettingsInfoPage.defaultProps = {
  person: {
    id: null,
    givenName: '',
    familyName: '',
    body: '',
    gender: PERSON.GENDER.NEUTRAL,
    usertype: PERSON.TYPE.REGISTERED,
  },
  isFetching: false,
  error: '',
  success: false,
};

const mapStateToProps = (state) => {
  const {
    person,
    success,
    error,
    isFetching,
  } = state.personReducer;

  const {
    viewer,
  } = state.authReducer;

  return {
    person,
    error,
    success,
    viewer,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(readPerson(id));
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
