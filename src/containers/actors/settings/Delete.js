import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Person as PERSON } from '../../../constants';
import ActorDeleteForm from '../../../components/actor/forms/Delete';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';
import * as actions from '../../../actions';

import ActorsType from '../../../proptypes/Actors';
import ActorDefault from '../../../proptypes/ActorDefault';
import PersonType from '../../../proptypes/Person';

const ActorsSettingsDelete = (props) => {
  const {
    readActor,
    resetActors,
    deleteActor,
    actors: {
      current: actor = { ...ActorDefault },
    },
    namespace,
    error,
    isFetching,
    success,
    viewer,
    computedMatch: {
      params,
    },
  } = props;

  const [field, setField] = useState({
    alias: {
      value: '',
      error: false,
      helperText: '',
    },
  });

  const [id] = params.id.split('-');

  useEffect(() => {
    readActor(id);

    return () => {
      resetActors();
    };
  }, []);

  const validateField = (name, value) => {
    const fieldError = {
      error: false,
      helperText: '',
    };

    const { alias } = actor;

    if (value === '' || value !== alias) {
      fieldError.error = true;
      fieldError.helperText = 'You must type the exact alias to delete this profile!';
    }

    if (value === alias) {
      fieldError.error = false;
      fieldError.helperText = 'This is the correct alias!';
    }

    setField({
      ...field,
      [name]: { ...fieldError },
    });

    return !fieldError.error;
  };

  const validate = () => {
    const { alias } = field;
    return validateField('alias', alias.value);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
    setField({
      ...field,
      alias: {
        ...field.alias,
        value,
      },
    });
  };

  const handleDelete = () => {
    if (validate()) {
      deleteActor(actor);
    }
  };

  const canDelete = () => {
    if (viewer.type !== PERSON.TYPE.SUPER_ADMIN) {
      if (viewer.id === actor.id) {
        return true;
      }
    }

    if (viewer.usertype === PERSON.TYPE.ADMIN) {
      if (actor.objecttype === 'com:people:person') {
        if (actor.usertype !== PERSON.TYPE.SUPER_ADMIN) {
          return true;
        }
      }
    }

    if ([
      PERSON.TYPE.ADMIN,
      PERSON.TYPE.SUPER_ADMIN,
    ].includes(viewer.usertype)) {
      return true;
    }

    if (actor.administratorIds) {
      if (actor.administratorIds.indexOf(String(viewer.id)) > -1) {
        return true;
      }
    }

    return false;
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  if (success) {
    return (
      <Redirect to={`/${namespace}/`} />
    );
  }

  return (
    <ActorSettingCard
      namespace={namespace}
      actor={actor}
    >
      <ActorDeleteForm
        referenceAlias={actor.alias}
        alias={field.alias.value}
        aliasError={field.alias.error}
        aliasHelperText={field.alias.helperText}
        canDelete={canDelete()}
        isFetching={isFetching}
        error={error}
        handleFieldChange={handleFieldChange}
        handleDelete={handleDelete}
        dismissPath={`/${namespace}/${actor.id}/settings/`}
      />
    </ActorSettingCard>
  );
};

ActorsSettingsDelete.propTypes = {
  readActor: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  deleteActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      success,
      isFetching,
    } = state[namespace];

    const {
      viewer,
    } = state.session;

    return {
      actors: state[namespace][namespace],
      namespace,
      viewer,
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
        return dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        return dispatch(actions[namespace].reset());
      },
      deleteActor: (actor) => {
        return dispatch(actions[namespace].deleteItem(actor));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsDelete);
};
