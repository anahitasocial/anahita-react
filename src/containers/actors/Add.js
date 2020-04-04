import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ActorInfoForm from '../../components/actor/forms/Info';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';

const BODY_CHARACTER_LIMIT = 350;

const ActorsAdd = (props) => {
  const {
    addActor,
    actors: {
      current: actor = { ...ActorDefault },
    },
    namespace,
    isFetching,
    success,
    error,
  } = props;

  const [fieldParams, setFieldParams] = useState({
    name: {
      error: false,
      helperText: '',
    },
    body: {
      error: false,
      helperText: '',
    },
  });

  const validateField = (name, value) => {
    const fieldError = {
      error: false,
      helperText: '',
    };

    switch (name) {
      case 'name':
        if (value.length < 6) {
          fieldError.error = true;
          fieldError.helperText = 'At least 6 characters are required!';
        }
        break;
      case 'body':
        if (value.length > BODY_CHARACTER_LIMIT) {
          fieldError.error = true;
          fieldError.helperText = `You have exceeded the ${BODY_CHARACTER_LIMIT} character limit!`;
        }
        break;
      default:
        if (value === '') {
          fieldError.error = true;
          fieldError.helperText = 'This field is required!';
        }
    }

    setFieldParams({
      ...fieldParams,
      [name]: { ...fieldError },
    });

    return !fieldError.error;
  };

  const validate = () => {
    const { name, body } = actor;
    const nameValidated = validateField('name', name);
    const bodyValidated = validateField('body', body);

    return nameValidated && bodyValidated;
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    validateField(name, value.trim());
    actor[name] = value;
  };

  const saveActor = () => {
    const { name, body } = actor;
    addActor({ name, body });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      saveActor();
    }
  };

  if (success) {
    return (
      <Redirect to={`/${namespace}/${actor.id}/`} />
    );
  }

  return (
    <React.Fragment>
      <Card>
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
          formTitle={`Add new ${singularize(namespace)}`}
          name={actor.name}
          nameError={fieldParams.name.error}
          nameHelperText={fieldParams.name.helperText}
          body={actor.body}
          bodyError={fieldParams.body.error}
          bodyHelperText={fieldParams.body.helperText}
          handleFieldChange={handleFieldChange}
          handleFormSubmit={handleFormSubmit}
          isFetching={isFetching}
          dismissPath={`/${namespace}/`}
        />
      </Card>
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
    </React.Fragment>
  );
};

ActorsAdd.propTypes = {
  addActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
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
      actors: state[namespace][namespace],
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
      addActor: (actor) => {
        return dispatch(actions[namespace].add(actor));
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
