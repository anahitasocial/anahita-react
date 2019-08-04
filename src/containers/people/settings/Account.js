import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountForm from '../../../components/person/AccountForm';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import * as actions from '../../../actions';
import * as validate from '../validate';

import PersonDefault from '../../../proptypes/PersonDefault';
import PeopleType from '../../../proptypes/People';

class PeopleSettingsAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: PersonDefault,
      usernameError: false,
      usernameHelperText: '',
      emailError: false,
      emailHelperText: '',
      passwordError: false,
      passwordHelperText: '',
      isFetching: false,
      success: false,
      error: '',
    };

    const {
      computedMatch: {
        params: {
          id,
        },
      },
    } = props;
    this.id = id;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillMount() {
    const { readPerson } = this.props;
    readPerson(this.id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      people,
      isFetching,
      success,
      error,
    } = nextProps;

    const person = { ...people.current };
    delete person.password;

    this.setState({
      person,
      isFetching,
      success,
      error,
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
    const {
      person: {
        id,
        email,
        username,
        password,
      },
    } = this.state;

    this.props.editPerson({
      id,
      email,
      username,
      password,
    });
  }

  handleEdit() {
    if (this.validate()) {
      this.editPerson();
    }
  }

  render() {
    const {
      person,
      usernameHelperText,
      usernameError,
      emailHelperText,
      emailError,
      passwordError,
      passwordHelperText,
      isFetching,
      success,
      error,
    } = this.state;

    return (
      <React.Fragment>
        <ActorSettingCard
          namespace="people"
          actor={person}
        >
          <AccountForm
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
            handleEdit={this.handleEdit}
            dismissPath={`/people/${person.id}/settings/`}
            isFetching={isFetching}
            success={success}
            error={error}
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
            message="Account Updated!"
            type="success"
          />
        }
      </React.Fragment>
    );
  }
}

PeopleSettingsAccount.propTypes = {
  readPerson: PropTypes.func.isRequired,
  editPerson: PropTypes.func.isRequired,
  people: PeopleType.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    people,
    isFetching,
    success,
    error,
  } = state.people;

  return {
    people,
    error,
    success,
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
)(PeopleSettingsAccount);
