/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';

import CardContent from '@material-ui/core/CardContent';

import actions from '../../../actions';
import apis from '../../../api';
import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';
// import PersonType from '../../../proptypes/Person';

import ActorSettingCard from '../../../components/cards/ActorSetting';
import ActorsFormsNotifications from '../../../components/actor/forms/Notifications';
import Progress from '../../../components/Progress';

const initEmailSettings = {
  emailMutedGlobally: false,
  sendEmail: false,
};

const ActorsNotificationsEdit = (props) => {
  const {
    readActor,
    resetActors,
    actor,
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailSettings, setEmailSettings] = useState(initEmailSettings);

  const api = apis[namespace][singularize(namespace)].notifications;

  useEffect(() => {
    if (id) {
      readActor(id, namespace);
    }

    return () => {
      resetActors();
    };
  }, [id, namespace]);

  useEffect(() => {
    if (actor.id) {
      setIsSubscribed(actor.isSubscribed);

      api.read(actor)
        .then((result) => {
          const { data } = result.data;
          setEmailSettings({
            emailMutedGlobally: data.email_muted_globally,
            sendEmail: data.send_email,
          });
        })
        .catch((err) => {
          return console.error(err);
        });
    }
  }, [actor.id]);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.sucess'));
    }
  }, [error, alertError, success, alertSuccess]);

  const handleEditType = () => {
    api.editType(actor)
      .then(() => {
        alertSuccess(i18n.t('prompts:saved.success'));
        setIsSubscribed(!isSubscribed);
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
          sendEmail: !target.checked,
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
        <ActorsFormsNotifications
          namespace={namespace}
          emailMutedGlobally={emailSettings.emailMutedGlobally}
          sendEmail={emailSettings.sendEmail}
          isSubscribed={isSubscribed}
          handleEditType={handleEditType}
          handleEdit={handleEdit}
        />
      </CardContent>
    </ActorSettingCard>
  );
};

ActorsNotificationsEdit.propTypes = {
  actor: ActorType.isRequired,
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

    return {
      actor,
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
