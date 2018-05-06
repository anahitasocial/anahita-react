import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Card, { CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import PersonAddForm from '../../components/PersonAddForm';
import { addPerson } from '../../actions/person';
import { Person as PERSON } from '../../constants';
import validate from './validate';

const styles = {
  root: {
    width: '100%',
  },
};

class PersonAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {},
      givenNameError: false,
      givenNameHelperText: '',
      familyNameError: false,
      familyNameHelperText: '',
      usernameError: false,
      usernameHelperText: '',
      emailError: false,
      emailHelperText: '',
      usertypeError: false,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      person: Object.assign({}, nextProps.person),
    });
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
    const { person } = this.state;
    this.props.addPerson(person);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.savePerson();
    }
  }

  render() {
    const {
      classes,
      success,
      error,
      isFetching,
      viewer,
    } = this.props;

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
    } = this.state;

    return (
      <div className={classes.root}>
        <Card>
          <CardHeader
            title={this.getName()}
            subheader={person.username ? `@${person.username}` : ''}
            avatar={
              <Avatar
                aria-label={this.getName() || ''}
                className={classes.avatar}
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
            usertype={person.usertype || PERSON.TYPE.REGISTERED}
            usertypeError={usertypeError}
            handleFieldChange={this.handleFieldChange}
            handleFormSubmit={this.handleFormSubmit}
            isFetching={isFetching}
            dismissPath="/people/"
            error={error}
          />
        </Card>
        {success && person.id &&
          <Redirect to={`/people/${person.id}/`} />
        }
      </div>
    );
  }
}

PersonAddPage.propTypes = {
  classes: PropTypes.object.isRequired,
  addPerson: PropTypes.func.isRequired,
  viewer: PropTypes.object.isRequired,
  person: PropTypes.object,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

PersonAddPage.defaultProps = {
  person: {
    id: null,
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    usertype: PERSON.TYPE.REGISTERED,
    gender: PERSON.GENDER.NEUTRAL,
  },
  isFetching: false,
  success: false,
  error: '',
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
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPerson: (person) => {
      dispatch(addPerson(person));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonAddPage));
