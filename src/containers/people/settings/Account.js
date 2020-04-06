import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountForm from '../../../components/person/AccountForm';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import * as actions from '../../../actions';
import * as api from '../../../api';

import PersonDefault from '../../../proptypes/PersonDefault';
import PeopleType from '../../../proptypes/People';

import formFields from '../../../formfields/person/account';

const PeopleSettingsAccount = (props) => {
  const {
    readPerson,
    editPerson,
    people: {
      current: person = { ...PersonDefault },
    },
    success,
    isFetching,
    error,
    computedMatch: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    readPerson(id);
  }, []);

  formFields.username.value = person.username;
  formFields.email.value = person.email;

  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    setFields({
      ...fields,
      [name]: {
        value: value.trim(),
        isValid: target.willValidate && target.checkValidity(),
        error: target.validationMessage,
      },
    });
  };

  const handleOnBlur = (event) => {
    event.preventDefault();

    const { target } = event;
    const { name, value } = target;
    const {
      email: cEmail,
      username: cUsername,
    } = person;

    if (
      name === 'username' &&
      fields.username.value !== cUsername &&
      fields.username.isValid
    ) {
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

    if (
      name === 'email' &&
      fields.email.value !== cEmail &&
      fields.email.isValid
    ) {
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

  const isValid = () => {
    const keys = Object.keys(fields);
    return keys.filter((f) => {
      return f.isValid === false;
    }).length === 0;
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (isValid()) {
      const {
        email,
        username,
        password,
      } = fields;

      editPerson({
        id,
        email: email.value,
        username: username.value,
        password: password.value,
      });
    }
  };

  if (!person.id && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      <ActorSettingCard
        namespace="people"
        actor={person}
      >
        <AccountForm
          fields={fields}
          handleOnChange={handleOnChange}
          handleOnBlur={handleOnBlur}
          handleOnSubmit={handleOnSubmit}
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
};

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
      return dispatch(actions.people.read(id));
    },
    editPerson: (person) => {
      return dispatch(actions.people.edit(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleSettingsAccount);
