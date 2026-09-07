import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import InfoForm from './InfoForm';
import InfoRead from './InfoRead';
import Progress from '../../../components/Progress';
import actions from '../../../actions';
import permissions from '../../../permissions';
import { Person as PERSON } from '../../../constants';
import PersonType from '../../../proptypes/Person';
import form from '../../../utils/form';
import i18n from '../../../languages';

const { SUPER_ADMIN } = PERSON.FIELDS.USERTYPE;

const formFields = form.createFormFields([
  'givenName',
  'familyName',
  'body',
  'websiteUrl',
]);

const { canAdminister } = permissions.actor;

const PersonSettingsInfo = (props) => {
  const {
    editPerson,
    viewer,
    isFetching,
    person: _Person,
  } = props;

  const [person, setPerson] = useState({
    ..._Person,
  });

  const [fields, setFields] = useState(formFields);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel discards the edits by re-seeding from the store, not by remembering
  // what changed. Everything typed since Edit was pressed has been written
  // straight onto local `person` state by handleOnChange, so simply hiding the
  // form would leave those values on screen in the read view as though they
  // had been saved.
  const handleCancel = () => {
    setPerson({ ..._Person });
    setFields(formFields);
    setIsEditing(false);
  };

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
    setPerson({ ...person });
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
        enabled: person.enabled,
      });

      // Collapse on submit, like the other cards in this section. The result
      // arrives as a page-level alert from containers/actors/Settings rather
      // than back through here, so there is nothing to wait for; on failure
      // the alert says so and the values are still in local state to re-open.
      setIsEditing(false);
    }

    setFields({ ...newFields });
  };

  if (!person.id && isFetching) {
    return (
      <Progress />
    );
  }

  const isSuperAdmin = viewer.usertype === SUPER_ADMIN;
  const canAdmin = canAdminister(person) && viewer.id !== person.id;
  const joinedDate = moment.utc(person.creationTime).format('LLL').toString();

  if (!isEditing) {
    return (
      <InfoRead
        person={person}
        canAdmin={canAdmin}
        joinedDate={joinedDate}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <InfoForm
      fields={fields}
      person={person}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      handleOnCancel={handleCancel}
      isFetching={isFetching}
      canChangeUsertype={canAdmin}
      isSuperAdmin={isSuperAdmin}
      enabled={canAdmin &&
        <>
          <Typography variant="caption" display="block">
            {i18n.t('people:person.joinedDate', { date: joinedDate })}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                name="enabled"
                checked={person.enabled}
                onChange={handleOnChange}
              />
            }
            label={i18n.t('commons:enabled')}
          />
        </>}
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
