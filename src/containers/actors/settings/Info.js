import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import ActorInfoForm from '../../../components/actor/forms/Info';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';
import SimpleSnackbar from '../../../components/SimpleSnackbar';
import * as actions from '../../../actions';
import form from '../../../utils/forms';

import ActorsType from '../../../proptypes/Actors';
import ActorDefault from '../../../proptypes/ActorDefault';

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

  const [fields, setFields] = useState({
    name: {
      value: '',
      isValid: false,
      error: '',
    },
    body: {
      value: '',
      isValid: false,
      error: '',
    },
  });

  const [id] = params.id.split('-');

  useEffect(() => {
    readActor(id);
  }, []);

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
      const { name, body } = actor;
      editActor({
        id,
        name,
        body,
      });
    }

    setFields({ ...newFields });
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
          formTitle={`${singularize(namespace)} information`}
          actor={actor}
          fields={fields}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
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
