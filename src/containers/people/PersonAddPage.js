import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Card, {
  CardHeader,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import PersonAddForm from '../../components/PersonAddForm';
import { addPerson } from '../../actions/person';
import { Person as PERSON } from '../../constants';

const styles = {
  root: {
    width: '100%',
  },
};

class PersonAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: props.person,
      hasGivenName: true,
      hasFamilyName: true,
      hasUsername: true,
      hasEmail: true,
      hasUsertype: true,
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
    person[name] = value;
    this.setState({
      person,
      [`has${name.toUpperCase()}`]: Boolean(value),
    });
  }

  validate() {
    const {
      givenName,
      familyName,
      username,
      email,
      usertype,
    } = this.state.person;

    this.setState({
      hasGivenName: Boolean(givenName),
      hasFamilyName: Boolean(familyName),
      hasUsername: Boolean(username),
      hasEmail: Boolean(email),
      hasUsertype: Boolean(usertype),
    });

    return Boolean(givenName) &&
    Boolean(familyName) &&
    Boolean(username) &&
    Boolean(email) &&
    Boolean(usertype);
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
      hasGivenName,
      hasFamilyName,
      hasUsername,
      hasEmail,
      hasUsertype,
      person,
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
            hasGivenname={hasGivenName}
            hasFamilyname={hasFamilyName}
            hasUsername={hasUsername}
            hasEmail={hasEmail}
            hasUsertype={hasUsertype}
            givenName={person.givenName}
            familyName={person.familyName}
            username={person.username}
            email={person.email}
            usertype={person.usertype}
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
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

PersonAddPage.defaultProps = {
  person: {
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    usertype: PERSON.TYPE.REGISTERED,
  },
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
