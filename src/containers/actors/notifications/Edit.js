import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';

import CardContent from '@material-ui/core/CardContent';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';

import actions from '../../../actions';
import apis from '../../../api';
import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';
// import PersonType from '../../../proptypes/Person';

import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';

const initEmailSettings = {
  email_muted_globally: false,
  send_email: false,
};

const ActorsNotificationsEdit = (props) => {
  const {
    readActor,
    resetActors,
    actor,
    // viewer,
    alertSuccess,
    alertError,
    namespace,
    computedMatch: {
      params,
    },
    isFetching,
    error,
    success,
  } = props;

  const [id] = params.id.split('-');
  const [isSubscribed, setIsSubscribed] = useState(actor.isSubscribed ? 0 : 1);
  const [emailSettings, setEmailSettings] = useState(initEmailSettings);
  const api = apis[namespace][singularize(namespace)].notifications;

  useEffect(() => {
    if (id) {
      readActor(id, namespace);
    }

    return () => {
      resetActors();
    };
  }, [readActor, id, namespace, resetActors]);

  useEffect(() => {
    if (actor.id) {
      api.read(actor)
        .then((result) => {
          const { data } = result.data;
          setEmailSettings({
            ...emailSettings,
            ...data,
          });
        })
        .catch((err) => {
          return console.error(err);
        });
    }
  }, [actor.id]);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Updated successfully!');
    }
  }, [error, alertError, success, alertSuccess]);

  const handleEditType = () => {
    api.editType(actor)
      .then(() => {
        alertSuccess(i18n.t('prompts:saved.success'));
        setIsSubscribed(isSubscribed === 1 ? 0 : 1);
      }).catch(() => {
        alertError(i18n.t('prompts:saved.error'));
      });
  };

  const handleEdit = (event) => {
    const { target } = event;
    api.edit({
      actor,
      sendEmail: target.checked,
    })
      .then(() => {
        alertSuccess(i18n.t('prompts:saved.success'));
        setEmailSettings({
          ...emailSettings,
          send_email: !target.checked,
        });
      }).catch(() => {
        alertError(i18n.t('prompts:saved.error'));
      });
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <ActorSettingCard
      namespace={namespace}
      actor={actor}
      subheader={i18n.t(`${namespace}:notifications.cTitle`)}
    >
      <CardContent>
        <FormControl margin="normal" fullWidth>
          <FormLabel component="legend">
            {i18n.t(`${namespace}:notifications.optionsTitle`)}
            :
          </FormLabel>
          <RadioGroup
            aria-label="gender"
            value={isSubscribed}
            onChange={handleEditType}
          >
            <FormControlLabel
              value={0}
              control={<Radio />}
              label={i18n.t(`${namespace}:notifications.options.all`)}
            />
            <FormControlLabel
              value={1}
              control={<Radio />}
              label={i18n.t(`${namespace}:notifications.options.following`)}
            />
          </RadioGroup>
        </FormControl>
        {!emailSettings.email_muted_globally &&
        <FormControlLabel
          control={
            <Switch
              checked={emailSettings.send_email}
              onChange={handleEdit}
              name="sendEmail"
            />
          }
          label={i18n.t(`${namespace}:notifications.email`)}
        />}
      </CardContent>
    </ActorSettingCard>
  );
};

ActorsNotificationsEdit.propTypes = {
  actor: ActorType.isRequired,
  // viewer: PersonType.isRequired,
  readActor: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
};

function mapStateToProps(namespace) {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      }, isFetching, error, success,
    } = state[namespace];

    const {
      viewer,
    } = state.session;

    return {
      actor,
      viewer,
      namespace,
      isFetching,
      error,
      success,
    };
  };
}

function mapDispatchToProps(namespace) {
  return (dispatch) => {
    return {
      readActor: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        return dispatch(actions[namespace].reset());
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
}

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsNotificationsEdit);
};
