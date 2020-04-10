import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonInfoForm from '../../components/person/InfoForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import { Person as PERSON } from '../../constants';
import form from '../../utils/forms';
import formFields from '../../formfields/person/info';

import PersonType from '../../proptypes/Person';
import PersonDefault from '../../proptypes/PersonDefault';
import PeopleType from '../../proptypes/People';

const { TYPE } = PERSON.FIELDS;

const PeopleAdd = (props) => {
  const {
    addPerson,
    viewer,
    people: {
      current: person = { ...PersonDefault },
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

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const {
        givenName,
        familyName,
        body,
        gender,
        usertype,
      } = person;

      addPerson({
        givenName,
        familyName,
        body,
        gender,
        usertype,
      });
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
      <Card>
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
        <PersonInfoForm
          isSuperAdmin={isSuperAdmin}
          fields={fields}
          person={person}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isFetching={isFetching}
          canChangeUsertype
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
  addPerson: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  people: PeopleType.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
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
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPerson: (params) => {
      return dispatch(actions.people.add(params));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleAdd);
