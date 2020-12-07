import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddForm from '../../components/person/Add';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import * as api from '../../api';
import { Person as PERSON } from '../../constants';
import form from '../../utils/form';

import PersonType from '../../proptypes/Person';
import PeopleType from '../../proptypes/People';

const { TYPE } = PERSON.FIELDS;
const formFields = form.createFormFields([
  'givenName',
  'familyName',
  'body',
  'username',
  'email',
  'gender',
  'usertype',
]);

const PeopleAdd = (props) => {
  const {
    addItem,
    viewer,
    items: {
      current: person,
    },
    success,
    isFetching,
    error,
  } = props;

  const [fields, setFields] = useState(formFields);

  const getInitials = () => {
    const givenName = person.givenName.charAt(0);
    const familyName = person.familyName.charAt(0);
    return `${givenName}${familyName}`;
  };

  const getName = () => {
    return `${person.givenName} ${person.familyName}`;
  };

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    person[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnBlur = (event) => {
    event.preventDefault();

    const { target } = event;
    const { name, value } = target;

    if (name === 'username' && fields.username.isValid) {
      api.is.username(value).catch(() => {
        setFields({
          ...fields,
          username: {
            ...fields.username,
            isValid: false,
            error: 'Username is already taken!',
          },
        });
      });
    }

    if (name === 'email' && fields.email.isValid) {
      api.is.email(value).catch(() => {
        setFields({
          ...fields,
          email: {
            ...fields.email,
            isValid: false,
            error: 'Email is already available in our system!',
          },
        });
      });
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      addItem(formData);
    }

    setFields({ ...newFields });
  };

  const isSuperAdmin = viewer.usertype === TYPE.SUPER_ADMIN;

  if (success) {
    return (
      <Redirect to={`/people/${person.id}/`} />
    );
  }

  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardHeader
          title={getName()}
          subheader={person.username ? `@${person.username}` : ''}
          avatar={
            <Avatar
              aria-label={getName()}
              alt={getName()}
            >
              {getInitials() || <PersonAddIcon />}
            </Avatar>
          }
        />
        <PersonAddForm
          isSuperAdmin={isSuperAdmin}
          fields={fields}
          person={person}
          handleOnChange={handleOnChange}
          handleOnBlur={handleOnBlur}
          handleOnSubmit={handleOnSubmit}
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
};

PeopleAdd.propTypes = {
  addItem: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  items: PeopleType.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    people: items,
    success,
    error,
    isFetching,
  } = state.people;

  const {
    viewer,
  } = state.session;

  return {
    items,
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (params) => {
      return dispatch(actions.people.add(params));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleAdd);
