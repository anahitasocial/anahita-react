import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import form from '../../../utils/form';
import api from '../../../api';
import i18n from '../../../languages';

import StepUpDialog from './StepUpDialog';

const formFields = form.createFormFields([
  'currentPassword',
  'totpPasscode',
]);

// Step-up container.
//
// Rendered by any card that performs a credential change. The card
// catches a 403, opens this, and passes an onVerified callback that
// retries whatever it was doing.
//
// Two modes, because the callers want different things.
//
// Credential changes (allowPassword, the default) want
// re-authentication: a passkey, or a password plus a passcode when TOTP
// is enrolled. That goes to /reauth/password.
//
// Data export sets allowPassword={false} and wants a SECOND FACTOR
// specifically: a passkey, or a TOTP passcode on its own. A password is
// not a second factor, so it is not offered — and the passcode goes to
// /totp/verify, which takes a code without one. Routing it through
// /reauth/password would be impossible, since that endpoint requires a
// password by construction.
//
// What the dialog offers is read from the SERVER when it opens, not
// from the session viewer. It used to read viewer.passkeyEnabled and
// viewer.totpEnabled, and neither field exists: nothing in the app ever
// set them, so both were undefined and both hints were permanently
// false. The passkey button never appeared for anyone, and — the part
// that actually locked people out — a TOTP-enrolled person got no
// passcode field, submitted a password alone, and was refused by a
// server that had asked for a second factor they were never shown.
//
// These remain rendering hints either way. The server validates
// whichever proof actually arrives and never consults them, so a stale
// answer costs a wasted round trip, not a bypass — /reauth/passkey/begin
// answers 409 when there is no passkey after all, which is handled
// below.
const StepUp = ({
  open,
  onVerified,
  onCancel,
  allowPassword = true,
}) => {
  const [fields, setFields] = useState(formFields);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [usePasswordForm, setUsePasswordForm] = useState(false);

  // null until the two lookups come back. Kept as one object rather
  // than two booleans so there is a single "not known yet" state — with
  // separate flags defaulting to false the dialog would render a
  // password-only form for a moment and then rearrange under the
  // person's hands.
  const [capabilities, setCapabilities] = useState(null);

  // Read on open rather than on mount: the card holding this keeps it
  // mounted and closed, and a passkey deleted or TOTP enrolled since
  // the page loaded should be reflected the next time the dialog is
  // actually used.
  //
  // Both lookups degrade to false on failure. Neither is authorisation
  // — the worst a wrong answer does is offer a method the server then
  // rejects, or hide one the person could have used, and the password
  // form stays available underneath in either case.
  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setCapabilities(null);

    Promise.all([
      api.totp.read()
        .then((response) => {
          return Boolean(response.data && response.data.data && response.data.data.enabled);
        })
        .catch(() => {
          return false;
        }),
      api.webauthn.browse()
        .then((response) => {
          return ((response.data && response.data.data) || []).length > 0;
        })
        .catch(() => {
          return false;
        }),
    ]).then(([totp, hasPasskey]) => {
      if (!cancelled) {
        setCapabilities({ totpEnabled: totp, hasPasskey });
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      cancelled = true;
    };
  }, [open]);

  const loading = capabilities === null;
  const totpEnabled = Boolean(capabilities && capabilities.totpEnabled);

  // Enrolled AND usable here. Someone can hold a passkey on a phone
  // while sitting at a browser that cannot run the ceremony, and
  // offering a button that throws would be worse than not offering it.
  const canUsePasskey = Boolean(capabilities && capabilities.hasPasskey)
    && api.webauthn.isSupported();

  const canUsePassword = allowPassword;

  // What the fallback form can collect at all. With no password and no
  // TOTP there is nothing to fall back to, and the dialog says so.
  const canUseCode = allowPassword || totpEnabled;

  const reset = () => {
    setFields(formFields);
    setErrors({});
    setUsePasswordForm(false);
    setCapabilities(null);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleVerified = () => {
    reset();
    onVerified();
  };

  const handleOnChange = (event) => {
    const { target } = event;
    setFields(form.validateField(target, fields));

    if (errors[target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[target.name];
        return next;
      });
    }
  };

  const handlePasskey = () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    api.reauth.passkey()
      .then(() => {
        setSubmitting(false);
        handleVerified();
      })
      .catch((err) => {
        setSubmitting(false);

        // A cancelled or dismissed OS prompt is not a failure worth
        // shouting about — they changed their mind. Leave the dialog
        // open so they can try again or switch to the password.
        if (err && err.name === 'NotAllowedError') {
          return;
        }

        const status = err && err.response && err.response.status;

        if (status === 429) {
          setErrors({ generic: i18n.t('auth:reauth.errors.forbidden') });
          return;
        }

        // 409 means the account has no passkey after all — the hint was
        // stale. Fall through to the other form when there is one.
        if (status === 409) {
          if (canUseCode) {
            setUsePasswordForm(true);
          }
          return;
        }

        setErrors({ generic: i18n.t('auth:reauth.errors.passkeyFailed') });
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const currentPassword = fields.currentPassword.value;
    const totpPasscode = fields.totpPasscode.value.trim();

    const next = {};
    if (canUsePassword && !currentPassword) {
      next.currentPassword = i18n.t('auth:reauth.errors.passwordRequired');
    }
    if (totpEnabled && !totpPasscode) {
      next.totpPasscode = i18n.t('auth:reauth.errors.totpRequired');
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    setErrors({});

    // Second-factor-only callers use /totp/verify, which accepts a
    // passcode without a password. /reauth/password cannot serve them:
    // it requires a password, which is exactly what this mode refuses
    // to accept as proof.
    const request = canUsePassword
      ? api.reauth.password({ currentPassword, totpPasscode })
      : api.totp.verify(totpPasscode);

    request
      .then(() => {
        setSubmitting(false);
        handleVerified();
      })
      .catch((err) => {
        setSubmitting(false);

        const status = err && err.response && err.response.status;

        // 401 and 403 are split by the server precisely so the error
        // lands on the field that was wrong. /totp/verify only ever
        // answers 403, which lands on the passcode either way.
        if (status === 401) {
          setErrors({ currentPassword: i18n.t('auth:reauth.errors.wrongPassword') });
          return;
        }

        if (status === 403) {
          setErrors({ totpPasscode: i18n.t('auth:reauth.errors.invalidPasscode') });
          return;
        }

        if (status === 429) {
          setErrors({ generic: i18n.t('auth:reauth.errors.forbidden') });
          return;
        }

        setErrors({ generic: i18n.t('auth:reauth.errors.generic') });
      });
  };

  return (
    <StepUpDialog
      open={open}
      loading={loading}
      canUsePasskey={canUsePasskey}
      canUsePassword={canUsePassword}
      canUseCode={canUseCode}
      totpEnabled={totpEnabled}
      usePasswordForm={usePasswordForm}
      fields={fields}
      errors={errors}
      submitting={submitting}
      onUsePassword={() => {
        return setUsePasswordForm(true);
      }}
      onPasskey={handlePasskey}
      onChange={handleOnChange}
      onSubmit={handleOnSubmit}
      onCancel={handleCancel}
    />
  );
};

StepUp.propTypes = {
  open: PropTypes.bool.isRequired,
  onVerified: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  allowPassword: PropTypes.bool,
};

// No longer connected. The only thing it took from the store was the
// viewer, and the two fields it read off it did not exist.
export default StepUp;
