import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfoForm from '../../../components/person/InfoForm';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import * as actions from '../../../actions';
import { Person as PERSON } from '../../../constants';
import PersonType from '../../../proptypes/Person';
import PersonDefault from '../../../proptypes/PersonDefault';
import PeopleType from '../../../proptypes/People';

const BODY_CHARACTER_LIMIT = 1000;

class PersonSettingsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: PersonDefault,
      givenNameError: false,
      givenNameHelperText: '',
      familyNameError: false,
      familyNameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
      isFetching: false,
      success: false,
      error: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

    const {
      readPerson,
      computedMatch: {
        params: {
          id,
        },
      },
    } = props;

    readPerson(id);
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      people,
      isFetching,
      success,
      error,
    } = nextProps;

    return {
      person: people.current,
      isFetching,
      success,
      error,
    };
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
    const { editPerson } = this.props;
    const {
      person: {
        id,
        givenName,
        familyName,
        body,
        gender,
        usertype,
      },
    } = this.state;

    editPerson({
      id,
      givenName,
      familyName,
      body,
      gender,
      usertype,
    });
  }

  handleEdit() {
    if (this.validate()) {
      this.editPerson();
    }
  }

  canChangeUsertype() {
    const { person } = this.state;
    const { viewer } = this.props;

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
    const { viewer } = this.props;

    const {
      person,
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      bodyError,
      bodyHelperText,
      isFetching,
      success,
      error,
    } = this.state;

    return (
      <React.Fragment>
        <ActorSettingCard
          namespace="people"
          actor={person}
          key="com:people.person"
        >
          <InfoForm
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
            handleEdit={this.handleEdit}
            isFetching={isFetching}
            canChangeUsertype={this.canChangeUsertype()}
            isSuperAdmin={
              viewer.usertype === PERSON.TYPE.SUPER_ADMIN
            }
            dismissPath={`/people/${person.id}/settings/`}
          />
        </ActorSettingCard>
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

PersonSettingsInfo.propTypes = {
  readPerson: PropTypes.func.isRequired,
  editPerson: PropTypes.func.isRequired,
  people: PeopleType.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    people,
    success,
    error,
    isFetching,
  } = state.people;

  const {
    viewer,
  } = state.session;

  return {
    people,
    error,
    success,
    viewer,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(actions.people.read(id));
    },
    editPerson: (person) => {
      dispatch(actions.people.edit(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfo);
