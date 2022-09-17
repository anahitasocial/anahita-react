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
  email_muted_globally: false,
  send_email: false,
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
            ...emailSettings,
            ...data,
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
          send_email: !target.checked,
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
          Notifications Settings
        </DialogTitle>
        <DialogContent>
          <ActorsFormsNotifications
            namespace={namespace}
            emailMutedGlobally={Boolean(emailSettings.email_muted_globally)}
            sendEmail={Boolean(emailSettings.send_email)}
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
            Close
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
