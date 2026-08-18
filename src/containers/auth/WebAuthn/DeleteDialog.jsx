import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import WebAuthnCredentialType from '../../../proptypes/WebAuthnCredential';

// DeleteDialog confirms revoking a passkey.
//
// Takes the credential rather than a boolean + name, so `open` derives
// from presence. That removes the state pair where the dialog is open
// and the target is null — the case the inline version had to guard
// with a ternary on every render of the message.
//
// The copy deliberately says the password and verification code still
// work. Revoking a passkey cannot lock anyone out, but a security
// dialog that only lists what you're about to lose reads like it
// might, and hesitation here means people keep passkeys they meant to
// remove.
const DeleteDialog = ({
  credential = null,
  isBusy = false,
  handleConfirm,
  handleCancel,
}) => {
  const { t } = useTranslation(['common', 'auth']);

  return (
    <Dialog
      open={Boolean(credential)}
      onClose={isBusy ? undefined : handleCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="passkey-delete-title"
    >
      <DialogTitle id="passkey-delete-title">
        {t('auth:webauthn.removeDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          {credential &&
            t('auth:webauthn.removeDialog.message', {
              name: credential.nickname,
            })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          disabled={isBusy}
          fullWidth
        >
          {t('common:cancel')}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleConfirm}
          disabled={isBusy}
          fullWidth
        >
          {t('common:remove')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  // null when closed — presence drives `open`.
  credential: WebAuthnCredentialType,
  isBusy: PropTypes.bool,
  handleConfirm: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default DeleteDialog;
