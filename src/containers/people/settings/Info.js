import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfoForm from '../../../components/person/Info';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import * as actions from '../../../actions';
import { Person as PERSON } from '../../../constants';
import PersonType from '../../../proptypes/Person';
import PersonDefault from '../../../proptypes/PersonDefault';
import PeopleType from '../../../proptypes/People';
import form from '../../../utils/forms';

const { ADMIN, SUPER_ADMIN } = PERSON.FIELDS.TYPE;
const formFields = form.createFormFields([
  'givenName',
  'familyName',
  'body',
  'gender',
  'usertype',
]);

const PersonSettingsInfo = (props) => {
  const {
    readPerson,
    editPerson,
    people: {
      current: person = { ...PersonDefault },
    },
    viewer,
    isFetching,
    success,
    error,
    computedMatch: {
      params,
    },
  } = props;

  const [fields, setFields] = useState(formFields);

  const [id] = params.id.split('-');

  useEffect(() => {
    readPerson(id);
  }, []);

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
        id,
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
  const dismissPath = `/people/${person.id}/settings/`;

  return (
    <React.Fragment>
      <ActorSettingCard
        namespace="people"
        actor={person}
        key="com:people.person"
      >
        <InfoForm
          fields={fields}
          person={person}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isFetching={isFetching}
          canChangeUsertype={canChangeUsertype()}
          isSuperAdmin={isSuperAdmin}
          dismissPath={dismissPath}
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
          message="Information Updated!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

PersonSettingsInfo.propTypes = {
  readPerson: PropTypes.func.isRequired,
  editPerson: PropTypes.func.isRequired,
  people: PeopleType.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    people,
    success,
    error,
    isFetching,
  } = state.people;

  const {
    viewer,
  } = state.session;

  return {
    people,
    error,
    success,
    viewer,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(actions.people.read(id));
    },
    editPerson: (person) => {
      dispatch(actions.people.edit(person));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfo);
