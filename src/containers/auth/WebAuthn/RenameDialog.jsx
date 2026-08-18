import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import WebAuthnCredentialType from '../../../proptypes/WebAuthnCredential';

// Mirrors constants.WebAuthnNicknameMaxLength on the Go side.
const NICKNAME_MAX_LENGTH = 64;

// RenameDialog changes the label on an enrolled passkey.
//
// Rename-only. It was previously a generic nickname collector shared
// with the add path, but the add path no longer asks for a name — the
// server derives one from the authenticator after the ceremony,
// because nothing useful about the device is known before it. That
// left this component with one caller and a set of props configuring a
// variation that no longer exists.
//
// Takes the credential rather than a string plus an open flag, so
// `open` derives from presence and the "open with no target" state
// cannot occur.
//
// The label is what distinguishes one passkey from another in the
// list. Someone with two iPhones gets two identical derived names, and
// this is how they tell them apart — which matters, because a person
// who can't identify a passkey won't revoke it.
const RenameDialog = ({
  credential = null,
  isBusy = false,
  error = '',
  handleConfirm,
  handleCancel,
}) => {
  const { t } = useTranslation(['common', 'auth']);
  const [nickname, setNickname] = useState('');

  // Seed from the credential each time it opens, so a cancelled edit
  // doesn't reappear holding the previous attempt's text.
  useEffect(() => {
    setNickname(credential ? credential.nickname : '');
  }, [credential]);

  const trimmed = nickname.trim();
  const canSubmit = trimmed.length > 0 &&
    trimmed.length <= NICKNAME_MAX_LENGTH &&
    !isBusy;

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    handleConfirm(trimmed);
  };

  return (
    <Dialog
      open={Boolean(credential)}
      onClose={isBusy ? undefined : handleCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="passkey-rename-title"
    >
      <DialogTitle id="passkey-rename-title">
        {t('auth:webauthn.renameDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          {t('auth:webauthn.renameDialog.message')}
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          margin="dense"
          label={t('auth:webauthn.nickname.label')}
          value={nickname}
          disabled={isBusy}
          error={Boolean(error)}
          helperText={error || t('auth:webauthn.nickname.counter', {
            count: trimmed.length,
            max: NICKNAME_MAX_LENGTH,
          })}
          inputProps={{ maxLength: NICKNAME_MAX_LENGTH }}
          onChange={(event) => {
            setNickname(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submit();
            }
          }}
        />
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
          color="primary"
          variant="contained"
          onClick={submit}
          disabled={!canSubmit}
          startIcon={isBusy ? <CircularProgress size={16} color="inherit" /> : null}
          fullWidth
        >
          {t('common:save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RenameDialog.propTypes = {
  // null when closed — presence drives `open`.
  credential: WebAuthnCredentialType,
  isBusy: PropTypes.bool,
  error: PropTypes.string,
  handleConfirm: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default RenameDialog;
