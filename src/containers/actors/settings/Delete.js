import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ActorDeleteForm from '../../../components/actor/forms/Delete';
import Progress from '../../../components/Progress';
import * as actions from '../../../actions';
import form from '../../../utils/form';

import ActorType from '../../../proptypes/Actor';

const formFields = form.createFormFields(['alias']);

const ActorsSettingsDelete = (props) => {
  const {
    deleteActor,
    actor,
    error,
    isFetching,
    history,
    namespace,
  } = props;

  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      deleteActor(actor).then(() => {
        history.push(`/${namespace}/`);
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
    <ActorDeleteForm
      referenceAlias={actor.alias}
      fields={fields}
      actor={actor}
      isFetching={isFetching}
      error={error}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
    />
  );
};

ActorsSettingsDelete.propTypes = {
  deleteActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  namespace: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
      error,
      success,
      isFetching,
    } = state[namespace];

    return {
      actor,
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
      deleteActor: (actor) => {
        return dispatch(actions[namespace].deleteItem(actor));
      },
    };
  };
};

export default (namespace) => {
  return withRouter(connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsDelete));
};
