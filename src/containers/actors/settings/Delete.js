import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Person as PERSON } from '../../../constants';
import ActorDeleteForm from '../../../components/actor/forms/Delete';
import Progress from '../../../components/Progress';
import * as actions from '../../../actions';
import form from '../../../utils/form';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';

const { TYPE } = PERSON.FIELDS;
const formFields = form.createFormFields(['alias']);

const ActorsSettingsDelete = (props) => {
  const {
    deleteActor,
    actor,
    error,
    isFetching,
    viewer,
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

  const canDelete = () => {
    if (viewer.type !== TYPE.SUPER_ADMIN) {
      if (viewer.id === actor.id) {
        return true;
      }
    }

    if (viewer.usertype === TYPE.ADMIN) {
      if (actor.objecttype === 'com:people:person') {
        if (actor.usertype !== TYPE.SUPER_ADMIN) {
          return true;
        }
      }
    }

    if ([TYPE.ADMIN, TYPE.SUPER_ADMIN].includes(viewer.usertype)) {
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

  return (
    <ActorDeleteForm
      referenceAlias={actor.alias}
      fields={fields}
      actor={actor}
      canDelete={canDelete()}
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
  viewer: PersonType.isRequired,
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

    const {
      viewer,
    } = state.session;

    return {
      actor,
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
