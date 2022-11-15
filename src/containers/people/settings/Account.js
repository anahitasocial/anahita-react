import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountForm from '../../../components/person/Account';
import Progress from '../../../components/Progress';
import actions from '../../../actions';
import api from '../../../api';

import PersonType from '../../../proptypes/Person';
import form from '../../../utils/form';
import i18n from '../../../languages';

const formFields = form.createFormFields([
  'username',
  'email',
  'password',
]);

const PeopleSettingsAccount = (props) => {
  const {
    editPerson,
    person,
    isFetching,
  } = props;

  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    person[name] = value.trim();

    const trimmed = ['username', 'email', 'password'];
    const newFields = form.validateField(target, fields, trimmed);

    setFields({ ...newFields });
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
            error: i18n.t('people:account.prompts.errorUsernameTaken'),
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
      editPerson({
        id: person.id,
        ...formData,
      });
    }
  };

  if (!person.id && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <AccountForm
      fields={fields}
      person={person}
      handleOnChange={handleOnChange}
      handleOnBlur={handleOnBlur}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
    />
  );
};

PeopleSettingsAccount.propTypes = {
  editPerson: PropTypes.func.isRequired,
  person: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    people: {
      current: person,
    },
    isFetching,
  } = state.people;

  return {
    person,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPerson: (person) => {
      return dispatch(actions.people.edit(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleSettingsAccount);
