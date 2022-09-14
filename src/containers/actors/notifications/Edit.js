/**
  COM-NOTIFICATIONS-ACTOR-EDIT-NOTIFICATION-SETTINGS-TITLE="%s's Notifications"
  COM-NOTIFICATIONS-ACTOR-EDIT-NOTIFICATION-SETTINGS-DESCRIPTION="Edit your notification settings"
  COM-NOTIFICATIONS-ACTOR-NOTIFICATION-CHANGE-EMAIL="Change Email"
  COM-NOTIFICATIONS-ACTOR-SEND-EMAIL="Email notifications to"
  COM-NOTIFICATIONS-ACTOR-RECIEVE-NOTIFICATIONS="Get notifications for"
  COM-NOTIFICATIONS-ACTOR-RECIEVE-NOTIFICATIONS-NEW-SB="All the posts"
  COM-NOTIFICATIONS-ACTOR-RECIEVE-NOTIFICATIONS-ONLY-SB="The posts I am following"
 */

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

import actions from '../../../actions';
import apis from '../../../api';
import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';
// import PersonType from '../../../proptypes/Person';

import ActorSettingCard from '../../../components/cards/ActorSetting';
import Progress from '../../../components/Progress';

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

  useEffect(() => {
    if (id) {
      readActor(id, namespace);
    }

    return () => {
      resetActors();
    };
  }, [readActor, id, namespace, resetActors]);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Updated successfully!');
    }
  }, [error, alertError, success, alertSuccess]);

  const handleSubscriptionEdit = () => {
    apis[namespace][singularize(namespace)].notifications.edit(actor)
      .then(() => {
        alertSuccess(i18n.t('prompts:saved.success'));
        setIsSubscribed(isSubscribed === 1 ? 0 : 1);
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
            onChange={handleSubscriptionEdit}
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
