import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import FingerprintIcon from '@material-ui/icons/Fingerprint';

import i18n from '../../../languages';

// Step-up prompt.
//
// Offers whichever proof the account actually has. A passkey stands
// alone — the OS gesture behind it is already a second factor — so when
// one is enrolled it is the primary action and the password form is
// tucked behind a link. Without a passkey, the password is shown, plus
// a passcode field when TOTP is enrolled.
//
// Presentational only. The container owns the API calls and decides
// what to retry afterwards.
const StepUpDialog = ({
  open,
  loading,
  canUsePasskey,
  canUsePassword,
  canUseCode,
  totpEnabled,
  usePasswordForm,
  fields,
  errors,
  submitting,
  onUsePassword,
  onPasskey,
  onChange,
  onSubmit,
  onCancel,
}) => {
  // The fallback form. Shown when there is no passkey, or when the
  // person chose it over one.
  //
  // canUseCode, not canUsePassword — a second-factor-only caller still
  // needs the passcode field even though it refuses passwords, and
  // gating the whole form on the password would leave a TOTP-only
  // person staring at an empty dialog.
  const showForm = !loading && canUseCode && (usePasswordForm || !canUsePasskey);

  // Nothing to offer at all: a second factor is required and the
  // account has neither. The card that opened this should have
  // explained already, but say it rather than showing an empty box.
  //
  // Gated on !loading, or it would be true for the moment before the
  // capability lookup returns and accuse every account of having no
  // method before finding out.
  const hasNoMethod = !loading && !canUsePasskey && !showForm;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{i18n.t('auth:reauth.cTitle')}</DialogTitle>

      <form onSubmit={onSubmit} noValidate>
        <DialogContent>
          <DialogContentText variant="body2">
            {i18n.t('auth:reauth.label')}
          </DialogContentText>

          {errors.generic &&
            <DialogContentText variant="body2" color="error">
              {errors.generic}
            </DialogContentText>}

          {/* The capability lookup is in flight. Nothing is rendered
              beneath it yet, because which methods exist is exactly
              what is not known — showing the password form now and
              adding a passcode field a moment later rearranges the
              dialog under the person's hands. */}
          {loading &&
            <CircularProgress size={24} />}

          {hasNoMethod &&
            <DialogContentText variant="body2" color="error">
              {i18n.t('auth:reauth.errors.noMethod')}
            </DialogContentText>}

          {!loading && canUsePasskey && !showForm &&
            <Button
              onClick={onPasskey}
              color="primary"
              variant="contained"
              disabled={submitting}
              startIcon={submitting
                ? <CircularProgress size={16} color="inherit" />
                : <FingerprintIcon />}
              fullWidth
            >
              {i18n.t('auth:reauth.usePasskey')}
            </Button>}

          {showForm &&
            <>
              {canUsePassword &&
              <TextField
                type="password"
                name="currentPassword"
                label={i18n.t('auth:reauth.fields.currentPassword')}
                value={fields.currentPassword.value}
                onChange={onChange}
                error={Boolean(errors.currentPassword)}
                helperText={errors.currentPassword || ''}
                fullWidth
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                autoFocus
                disabled={submitting}
                required
              />}

              {/* Only when the account has TOTP. The server decides
                  whether a passcode is required from the person record,
                  not from the payload — this just avoids showing a
                  field nobody could fill in. */}
              {totpEnabled &&
                <TextField
                  name="totpPasscode"
                  label={i18n.t('auth:reauth.fields.totpPasscode')}
                  value={fields.totpPasscode.value}
                  onChange={onChange}
                  error={Boolean(errors.totpPasscode)}
                  helperText={errors.totpPasscode || i18n.t('auth:reauth.fields.totpHelper')}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  autoComplete="one-time-code"
                  inputProps={{ inputMode: 'numeric', maxLength: 8 }}
                  disabled={submitting}
                  required
                />}
            </>}

          {/* Escape hatch. A passkey may be enrolled on a device the
              person is not holding right now, so the password route has
              to stay reachable. */}
          {!loading && canUsePasskey && canUsePassword && !usePasswordForm &&
            <Button onClick={onUsePassword} disabled={submitting} fullWidth>
              {i18n.t('auth:reauth.usePassword')}
            </Button>}
        </DialogContent>

        {/* fullWidth on both, matching every CardActions row in the
            settings cards. DialogActions is flex like CardActions, so
            two full-width buttons share the row evenly rather than
            bunching to the right — which is what made this dialog look
            unlike the cards that open it. */}
        <DialogActions>
          <Button onClick={onCancel} disabled={submitting} fullWidth>
            {i18n.t('actions:cancel')}
          </Button>
          {showForm &&
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
              fullWidth
            >
              {i18n.t('auth:reauth.submit')}
            </Button>}
        </DialogActions>
      </form>
    </Dialog>
  );
};

StepUpDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  canUsePasskey: PropTypes.bool.isRequired,
  canUsePassword: PropTypes.bool.isRequired,
  canUseCode: PropTypes.bool.isRequired,
  totpEnabled: PropTypes.bool.isRequired,
  usePasswordForm: PropTypes.bool.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  submitting: PropTypes.bool.isRequired,
  onUsePassword: PropTypes.func.isRequired,
  onPasskey: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default StepUpDialog;
