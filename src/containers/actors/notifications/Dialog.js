/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Icon from '@material-ui/icons/Notifications';

import actions from '../../../actions';
import apis from '../../../api';
import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';
import utils from '../../../utils';

import ActorsFormsNotifications from '../../../components/actor/forms/Notifications';

const initEmailSettings = {
  emailMutedGlobally: false,
  sendEmail: false,
};

const { node } = utils;

const ActorsNotificationsDialog = (props) => {
  const {
    actor,
    alertSuccess,
    alertError,
  } = props;

  const namespace = node.getNamespace(actor);

  const [open, setOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(actor.isSubscribed);
  const [emailSettings, setEmailSettings] = useState(initEmailSettings);

  const api = apis[namespace][singularize(namespace)].notifications;

  useEffect(() => {
    if (actor.id && open) {
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
  }, [actor.id, open]);

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

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>
          {i18n.t(`${namespace}:settings.notifications`)}
        </DialogTitle>
        <DialogContent>
          <ActorsFormsNotifications
            namespace={namespace}
            emailMutedGlobally={emailSettings.emailMutedGlobally}
            sendEmail={emailSettings.sendEmail}
            isSubscribed={isSubscribed}
            handleEditType={handleEditType}
            handleEdit={handleEdit}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            fullWidth
            variant="contained"
          >
            {i18n.t('actions:done')}
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        <Icon />
      </Button>
    </>
  );
};

ActorsNotificationsDialog.propTypes = {
  actor: ActorType.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsNotificationsDialog);
