import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import moment from 'moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import ActorInfoForm from '../../../components/actor/forms/Info';
import Progress from '../../../components/Progress';
import actions from '../../../actions';
import permissions from '../../../permissions';
import form from '../../../utils/form';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import i18n from '../../../languages';

const formFields = form.createFormFields([
  'name',
  'body',
  'website',
  'contact_url',
  'phone',
]);

const { canAdminister } = permissions.actor;

const ActorsSettingsInfo = (props) => {
  const {
    editActor,
    namespace,
    isFetching,
    viewer,
    actor: defaultActor,
  } = props;

  const [actor, setActor] = useState({
    ...defaultActor,
    ...defaultActor.information,
  });

  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value, checked } = target;

    if (name === 'enabled') {
      actor[name] = Boolean(checked);
    } else {
      actor[name] = value;
    }

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
    setActor({ ...actor });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      editActor({
        ...formData,
        id: actor.id,
        enabled: actor.enabled ? 1 : 0,
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
  const created = moment.utc(actor.creationTime).format('LLL').toString();

  return (
    <ActorInfoForm
      formTitle={formTitle}
      actor={actor}
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
      enabled={canAdminister(viewer) &&
        <>
          <Typography variant="caption" display="block">
            {`Created ${created}`}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                name="enabled"
                checked={actor.enabled}
                onChange={handleOnChange}
              />
            }
            label={i18n.t('commons:enabled')}
          />
        </>}
    />
  );
};

ActorsSettingsInfo.propTypes = {
  editActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
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

    const { viewer } = state.session;

    return {
      viewer,
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
