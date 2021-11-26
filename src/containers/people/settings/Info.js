import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import InfoForm from '../../../components/person/Info';
import Progress from '../../../components/Progress';
import actions from '../../../actions';
import permissions from '../../../permissions';
import { Person as PERSON } from '../../../constants';
import PersonType from '../../../proptypes/Person';
import form from '../../../utils/form';

const { SUPER_ADMIN } = PERSON.FIELDS.TYPE;

const formFields = form.createFormFields([
  'givenName',
  'familyName',
  'body',
  'website',
  'contact_url',
  'phone',
]);

const { canAdminister } = permissions.actor;

const PersonSettingsInfo = (props) => {
  const {
    editPerson,
    viewer,
    isFetching,
  } = props;

  const [person, setPerson] = useState({
    ...props.person,
    ...props.person.information,
  });

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
    }

    setFields({ ...newFields });
  };

  if (!person.id && isFetching) {
    return (
      <Progress />
    );
  }

  const isSuperAdmin = viewer.usertype === SUPER_ADMIN;
  const canAdmin = canAdminister(viewer) && viewer.id !== person.id;

  return (
    <InfoForm
      fields={fields}
      person={person}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
      canChangeUsertype={canAdmin}
      isSuperAdmin={isSuperAdmin}
      enabled={canAdmin &&
        <React.Fragment>
          <Typography variant="caption" display="block">
            Joined {moment.utc(person.creationTime).format('LLL').toString()}
          </Typography>
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
        </React.Fragment>
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
