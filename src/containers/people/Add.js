import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddForm from '../../components/person/Add';
import actions from '../../actions';
import api from '../../api';
import { Person as PERSON } from '../../constants';
import utils from '../../utils';

import PersonType from '../../proptypes/Person';
import PeopleType from '../../proptypes/People';
import i18n from '../../languages';

const { form } = utils;
const {
  getURL,
  getPersonInitials,
  getPersonName,
} = utils.node;

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
    alertError,
    alertSuccess,
    viewer,
    items: {
      current: person,
    },
    success,
    isFetching,
    error,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:added.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:added.success'));
    }
  }, [error, success]);

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
            error: i18n.t('people:account.prompts.errorUsernameTaken'),
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
            error: i18n.t('people:account.prompts.errorEmailTaken'),
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

  if (success && person.id) {
    return (
      <Redirect to={getURL(person)} />
    );
  }

  const personName = getPersonName(person);
  const personInitials = getPersonInitials(person) || <PersonAddIcon />;

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          title={personName}
          subheader={person.username ? `@${person.username}` : ''}
          avatar={
            <Avatar
              aria-label={personName}
              alt={personName}
            >
              {personInitials}
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
    </>
  );
};

PeopleAdd.propTypes = {
  addItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
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
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleAdd);
