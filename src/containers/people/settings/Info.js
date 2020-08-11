import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfoForm from '../../../components/person/Info';
import Progress from '../../../components/Progress';
import * as actions from '../../../actions';
import { Person as PERSON } from '../../../constants';
import PersonType from '../../../proptypes/Person';
import form from '../../../utils/form';

const { ADMIN, SUPER_ADMIN } = PERSON.FIELDS.TYPE;
const formFields = form.createFormFields([
  'givenName',
  'familyName',
  'body',
  'gender',
]);

const PersonSettingsInfo = (props) => {
  const {
    editPerson,
    person,
    viewer,
    isFetching,
  } = props;

  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    person[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
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

    setFields({ ...newFields });
  };

  const canChangeUsertype = () => {
    if (viewer.id !== person.id) {
      return [ADMIN, SUPER_ADMIN].includes(viewer.usertype);
    }

    return false;
  };

  if (!person.id && isFetching) {
    return (
      <Progress />
    );
  }

  const isSuperAdmin = viewer.usertype === SUPER_ADMIN;

  return (
    <InfoForm
      fields={fields}
      person={person}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
      canChangeUsertype={canChangeUsertype()}
      isSuperAdmin={isSuperAdmin}
    />
  );
};

PersonSettingsInfo.propTypes = {
  editPerson: PropTypes.func.isRequired,
  person: PersonType.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    people: {
      current: person,
    },
    isFetching,
  } = state.people;

  const {
    viewer,
  } = state.session;

  return {
    person,
    viewer,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editPerson: (person) => {
      dispatch(actions.people.edit(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfo);
