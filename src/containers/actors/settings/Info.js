import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import ActorInfoForm from '../../../components/actor/forms/Info';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import * as actions from '../../../actions';

import ActorsType from '../../../proptypes/Actors';
import ActorDefault from '../../../proptypes/ActorDefault';

const BODY_CHARACTER_LIMIT = 1000;

const ActorsSettingsInfo = (props) => {
  const {
    readActor,
    editActor,
    actors: {
      current: actor = { ...ActorDefault },
    },
    namespace,
    success,
    error,
    isFetching,
    computedMatch: {
      params,
    },
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

  const [id] = params.id.split('-');

  useEffect(() => {
    readActor(id);
  }, []);

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
    editActor({ id: actor.id, name, body });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      saveActor();
    }
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      <ActorSettingCard
        namespace={namespace}
        actor={actor}
      >
        <ActorInfoForm
          formTitle={`${singularize(namespace)} Information`}
          name={actor.name}
          nameError={fieldParams.name.error}
          nameHelperText={fieldParams.name.helperText}
          body={actor.body}
          bodyError={fieldParams.body.error}
          bodyHelperText={fieldParams.body.helperText}
          handleFieldChange={handleFieldChange}
          handleFormSubmit={handleFormSubmit}
          isFetching={isFetching}
          dismissPath={`/${namespace}/${actor.id}/settings/`}
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

ActorsSettingsInfo.propTypes = {
  readActor: PropTypes.func.isRequired,
  editActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  computedMatch: PropTypes.object.isRequired,
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
      readActor: (id) => {
        return dispatch(actions[namespace].read(id));
      },
      editActor: (actor) => {
        return dispatch(actions[namespace].edit(actor));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsInfo);
};
