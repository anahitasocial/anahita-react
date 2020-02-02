import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddForm from '../../components/person/AddForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import { Person as PERSON } from '../../constants';
import * as validate from './validate';

import PersonType from '../../proptypes/Person';
import PersonDefault from '../../proptypes/PersonDefault';
import PeopleType from '../../proptypes/People';

class PeopleAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: { ...PersonDefault },
      givenNameError: false,
      givenNameHelperText: '',
      familyNameError: false,
      familyNameHelperText: '',
      usernameError: false,
      usernameHelperText: '',
      emailError: false,
      emailHelperText: '',
      usertypeError: false,
      isFetching: false,
      success: false,
      error: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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

  getInitials() {
    const { person } = this.state;

    if (!person.id) {
      return '';
    }

    const givenName = person.givenName.charAt(0);
    const familyName = person.familyName.charAt(0);
    return `${givenName}${familyName}`;
  }

  getName() {
    const { person } = this.state;

    if (!person.id) {
      return '';
    }

    return `${person.givenName} ${person.familyName}`;
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
      case 'givenName':
      case 'familyName':
        if (value.length < 3) {
          fieldError.error = true;
          fieldError.helperText = 'At least 3 characters are required!';
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
      username,
      email,
      usertype,
    } = this.state.person;

    const givenNameValidated = this.validateField('givenName', givenName);
    const familyNameValidated = this.validateField('familyName', familyName);
    const usernameValidated = this.validateField('username', username);
    const emailValidated = this.validateField('email', email);
    const usertypeValidated = this.validateField('usertype', usertype);

    return givenNameValidated &&
    familyNameValidated &&
    usernameValidated &&
    emailValidated &&
    usertypeValidated;
  }

  savePerson() {
    const { addPerson } = this.props;
    const {
      person: {
        givenName,
        familyName,
        username,
        email,
        usertype,
      },
    } = this.state;

    addPerson({
      givenName,
      familyName,
      username,
      email,
      usertype,
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.savePerson();
    }
  }

  render() {
    const { viewer } = this.props;
    const {
      person,
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      usernameError,
      usernameHelperText,
      emailHelperText,
      emailError,
      usertypeError,
      isFetching,
      success,
      error,
    } = this.state;

    if (success) {
      return (
        <Redirect to={`/people/${person.id}/`} />
      );
    }

    return (
      <React.Fragment>
        <Card>
          <CardHeader
            title={this.getName()}
            subheader={person.username ? `@${person.username}` : ''}
            avatar={
              <Avatar
                aria-label={this.getName() || ''}
                alt={this.getName() || ''}
              >
                {this.getInitials() || <PersonAddIcon />}
              </Avatar>
            }
          />
          <PersonAddForm
            formTitle="Add New Person"
            isSuperAdmin={viewer.usertype === PERSON.TYPE.SUPER_ADMIN}
            givenName={person.givenName}
            givenNameError={givenNameError}
            givenNameHelperText={givenNameHelperText}
            familyName={person.familyName}
            familyNameError={familyNameError}
            familyNameHelperText={familyNameHelperText}
            username={person.username}
            usernameError={usernameError}
            usernameHelperText={usernameHelperText}
            email={person.email}
            emailError={emailError}
            emailHelperText={emailHelperText}
            usertype={person.usertype}
            usertypeError={usertypeError}
            handleFieldChange={this.handleFieldChange}
            handleFormSubmit={this.handleFormSubmit}
            isFetching={isFetching}
            dismissPath="/people/"
          />
        </Card>
        {error &&
          <SimpleSnackbar
            isOpen={Boolean(error)}
            message="Something went wrong!"
            type="error"
          />
        }
        {success && person.id &&
          <Redirect to={`/people/${person.id}/`} />
        }
      </React.Fragment>
    );
  }
}

PeopleAdd.propTypes = {
  addPerson: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  people: PeopleType.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
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
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPerson: (person) => {
      dispatch(actions.people.add(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleAdd);
