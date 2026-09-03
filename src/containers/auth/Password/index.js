import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import form from '../../../utils/form';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';

import PasswordEdit from './PasswordEdit';
import StepUp from '../StepUp';
import { Password as PASSWORD } from '../../../constants';

const { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } = PASSWORD;

// No currentPassword field. Re-authentication moved to the step-up
// dialog, which accepts a passkey as well — that is what lets someone
// who signs in by passkey change their password without recalling the
// old one. Requiring it kept exactly those people out: their only route
// was forgot-password, which deletes every passkey on the account.
const formFields = form.createFormFields([
  'newPassword',
]);

// Change-password card.
//
// Collapsed by default, matching the change-email card it sits beside:
// a settings page is read far more often than it is edited, and a form
// left permanently open invites accidental edits. Opening it is a
// deliberate act.
const Password = ({
  alertError,
  alertSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [stepUpOpen, setStepUpOpen] = useState(false);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name } = target;

    const newFields = form.validateField(target, fields);

    setFields(newFields);

    // Clear any field-level error as the user edits — they're
    // attempting to correct, no reason to keep the red helper text
    // sitting there.
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Toggle visibility of the new-password field. Hidden by default so
  // the user opts into showing it; defending against the rare
  // shoulder-surfing case while still letting them verify what they
  // typed (or what their password manager filled in).
  const handleToggleVisibility = () => {
    setShowNewPassword((prev) => {
      return !prev;
    });
  };

  // resetForm clears the inputs and any field-level errors, and hides
  // the new password again so it doesn't linger visible. Called on
  // open, on cancel, and after a successful submission — in every case
  // the next thing shown should be a clean slate.
  const resetForm = () => {
    setFields(formFields);
    setErrors({});
    setShowNewPassword(false);
  };

  const handleOpen = () => {
    resetForm();
    setIsEditing(true);
  };

  // Cancel discards whatever was typed. Nothing is kept for a later
  // reopen — a half-typed password sitting in state is not worth
  // preserving, and clearing it means the field never comes back
  // pre-filled with something the person no longer intends to use.
  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  // validateClientSide does the checks we can do without hitting the
  // server: presence and new-password length. Returns an errors object
  // keyed by field name, or null if valid. The server is still the
  // source of truth — these checks just avoid a round-trip for cases we
  // can catch locally.
  //
  // The "not the same as your current password" check is NOT among
  // them and cannot be. This form has no current-password field, and
  // the browser holds no hash to compare against — only the server can
  // answer it, which it does with a 409 handled below.
  const validateClientSide = (newPassword) => {
    const next = {};

    if (!newPassword) {
      next.newPassword = i18n.t('password:errors.newRequired');
    } else if (newPassword.length < PASSWORD_MIN_LENGTH) {
      next.newPassword = i18n.t('password:errors.newTooShort', { count: PASSWORD_MIN_LENGTH });
    } else if (newPassword.length > PASSWORD_MAX_LENGTH) {
      next.newPassword = i18n.t('password:errors.newTooLong', { count: PASSWORD_MAX_LENGTH });
    }

    return Object.keys(next).length > 0 ? next : null;
  };

  // Separate from handleOnSubmit so the step-up dialog can replay it
  // after a successful re-authentication.
  const submit = () => {
    const newPassword = fields.newPassword.value;

    setSubmitting(true);

    api.password.edit({ password: newPassword })
      .then((response) => {
        setSubmitting(false);
        resetForm();
        // Collapse on success, like the other credential cards. Stays
        // open on failure so the person can correct what they typed.
        setIsEditing(false);

        // The server reports how many other sessions it ended. Saying
        // so is the point of revoking them — "you were signed out
        // everywhere else" is only reassuring if it visibly happened.
        const revoked = (response && response.data && response.data.revokedSessions) || 0;

        alertSuccess(revoked > 0
          ? i18n.t('password:successSessions', { count: revoked })
          : i18n.t('password:success'));
      })
      .catch((err) => {
        setSubmitting(false);

        const status = err && err.response && err.response.status;

        // No recent step-up. Collect one, then retry.
        if (status === 403) {
          setStepUpOpen(true);
          return;
        }

        if (status === 429) {
          setErrors({ newPassword: i18n.t('password:errors.tooMany') });
          return;
        }

        // The new password is the one already on the account. A field
        // error rather than a toast: it is correctable right here, and
        // the card stays open with what they typed still in it.
        if (status === 409) {
          setErrors({ newPassword: i18n.t('password:errors.reused') });
          return;
        }

        // 400 means the server rejected the payload — usually because
        // the new password failed validation (length). Re-run client
        // validation to put the message on the right field; fall back
        // to a toast if nothing specific lit up.
        if (status === 400) {
          const serverErrors = validateClientSide(newPassword);
          if (serverErrors) {
            setErrors(serverErrors);
            return;
          }
        }

        alertError(i18n.t('password:errors.generic'));
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationErrors = validateClientSide(fields.newPassword.value);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    submit();
  };

  return (
    <>
      <PasswordEdit
        isEditing={isEditing}
        fields={fields}
        errors={errors}
        submitting={submitting}
        showNewPassword={showNewPassword}
        onOpen={handleOpen}
        onCancel={handleCancel}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
        onToggleVisibility={handleToggleVisibility}
      />
      <StepUp
        open={stepUpOpen}
        onVerified={() => {
          setStepUpOpen(false);
          submit();
        }}
        onCancel={() => {
          return setStepUpOpen(false);
        }}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
  };
};

Password.propTypes = {
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
};

export default withTranslation()(
  connect(
    null,
    mapDispatchToProps,
  )(Password),
);
