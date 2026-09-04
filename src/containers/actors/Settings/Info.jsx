import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import ActorInfoForm from '../Forms/Info';
import InfoRead from './InfoRead';
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
]);

const { canAdminister } = permissions.actor;

const ActorsSettingsInfo = (props) => {
  const {
    editActor,
    isFetching,
    viewer,
    actor: defaultActor,
  } = props;

  const [actor, setActor] = useState({
    ...defaultActor,
    ...defaultActor.information,
  });

  const [fields, setFields] = useState(formFields);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel re-seeds from the store rather than just hiding the form.
  // handleOnChange writes straight onto local `actor` state as you type, so
  // hiding the form alone would leave the discarded values on screen in the
  // read view as though they had been saved.
  const handleCancel = () => {
    setActor({ ...defaultActor, ...defaultActor.information });
    setFields(formFields);
    setIsEditing(false);
  };

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

      // Collapse on submit, like the other settings cards. The result comes
      // back as a page-level alert from containers/actors/Settings rather than
      // through here, so there is nothing to wait on.
      setIsEditing(false);
    }

    setFields({ ...newFields });
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  const created = `Created ${moment.utc(actor.creationTime).format('LLL').toString()}`;
  const canAdmin = canAdminister(viewer);

  if (!isEditing) {
    return (
      <InfoRead
        actor={actor}
        canAdmin={canAdmin}
        created={created}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <ActorInfoForm
      actor={actor}
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      handleOnCancel={handleCancel}
      isFetching={isFetching}
      enabled={canAdmin &&
        <>
          <Typography variant="caption" display="block">
            {created}
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
