import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import ActorInfoForm from '../../../components/actor/forms/Info';
import Progress from '../../../components/Progress';
import * as actions from '../../../actions';
import form from '../../../utils/form';

import ActorType from '../../../proptypes/Actor';

const formFields = form.createFormFields([
  'name',
  'body',
]);

const ActorsSettingsInfo = (props) => {
  const {
    editActor,
    actor,
    namespace,
    isFetching,
  } = props;

  const [fields, setFields] = useState(formFields);

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
      editActor({
        id: actor.id,
        ...formData,
      });
    }

    setFields({ ...newFields });
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  const formTitle = `${singularize(namespace)} information`;

  return (
    <ActorInfoForm
      formTitle={formTitle}
      actor={actor}
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
    />
  );
};

ActorsSettingsInfo.propTypes = {
  editActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
      isFetching,
    } = state[namespace];

    return {
      actor,
      namespace,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
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
