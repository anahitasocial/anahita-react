import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ActorInfoForm from '../../components/actor/forms/Info';
import * as actions from '../../actions';
import form from '../../utils/form';

import ActorsType from '../../proptypes/Actors';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const ActorsAdd = (props) => {
  const {
    addItem,
    alertError,
    alertSuccess,
    items: {
      current: actor,
    },
    namespace,
    isFetching,
    success,
    error,
  } = props;

  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Added successfully.');
    }
  }, [error, success]);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    actor[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
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

  if (success) {
    return (
      <Redirect to={`/${namespace}/${actor.id}/`} />
    );
  }

  return (
    <React.Fragment>
      <Card variant="outlined">
        <CardHeader
          title={actor.name}
          avatar={
            <Avatar
              aria-label={actor.name}
              alt={actor.name}
            >
              {actor.name ? actor.name.charAt(0).toUpperCase() : <GroupAddIcon />}
            </Avatar>
          }
        />
        <ActorInfoForm
          formTitle={`${singularize(namespace)} information`}
          actor={actor}
          fields={fields}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isFetching={isFetching}
          dismissPath={`/${namespace}/`}
        />
      </Card>
    </React.Fragment>
  );
};

ActorsAdd.propTypes = {
  addItem: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      success,
      error,
    } = state[namespace];

    return {
      items: state[namespace][namespace],
      namespace,
      isFetching,
      success,
      error,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      addItem: (node) => {
        return dispatch(actions[namespace].add(node));
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsAdd);
};
