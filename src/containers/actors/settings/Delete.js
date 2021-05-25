import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ActorDeleteForm from '../../../components/actor/forms/Delete';
import Progress from '../../../components/Progress';
import actions from '../../../actions';
import form from '../../../utils/form';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';

const formFields = form.createFormFields(['alias']);

const ActorsSettingsDelete = (props) => {
  const {
    deleteActor,
    logout,
    actor,
    viewer,
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
      const isViewer = actor.id === viewer.id;
      deleteActor(actor).then(() => {
        if (isViewer) {
          logout();
        }
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
  logout: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
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

    const { viewer } = state.session;

    return {
      actor,
      viewer,
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
      logout: () => {
        return dispatch(actions.session.deleteItem());
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
