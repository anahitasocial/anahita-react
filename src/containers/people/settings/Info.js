import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import InfoForm from '../../../components/person/Info';
import Progress from '../../../components/Progress';
import * as actions from '../../../actions';
import permissions from '../../../permissions';
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

const { canAdminister } = permissions.actor;

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
    const { name, value, checked } = target;

    if (name === 'enabled') {
      person[name] = Boolean(checked);
    } else {
      person[name] = value;
    }

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
        ...formData,
        id: person.id,
        enabled: person.enabled ? 1 : 0,
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
  const canEditEnable = canAdminister(viewer) && viewer.id !== person.id;

  return (
    <InfoForm
      fields={fields}
      person={person}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
      canChangeUsertype={canChangeUsertype()}
      isSuperAdmin={isSuperAdmin}
      enabled={canEditEnable &&
        <FormControlLabel
          control={
            <Switch
              name="enabled"
              checked={person.enabled}
              onChange={handleOnChange}
            />
          }
          label="Enabled"
        />
      }
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
