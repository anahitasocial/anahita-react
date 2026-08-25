import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import form from '../../../utils/form';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';

import PasswordEdit from './PasswordEdit';
import { Password as PASSWORD } from '../../../constants';

const { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } = PASSWORD;

const formFields = form.createFormFields([
  'currentPassword',
  'newPassword',
]);

const Password = ({
  alertError,
  alertSuccess,
}) => {
  const [fields, setFields] = useState(formFields);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  // resetForm clears the inputs and any field-level errors after a
  // successful submission. Returning to the cleared state matches what
  // the user expects — the section can be left open without confusion
  // about whether the change went through. Also hides the new password
  // again so it doesn't linger visible after submit.
  const resetForm = () => {
    setFields(formFields);
    setErrors({});
    setShowNewPassword(false);
  };

  // validateClientSide does the checks we can do without hitting the
  // server: presence, new-password length, and the "not same as
  // current" check. Returns an errors object keyed by field name, or
  // null if valid. The server is still the source of truth — these
  // checks just avoid a round-trip for cases we can catch locally.
  const validateClientSide = (currentPassword, newPassword) => {
    const next = {};

    if (!currentPassword) {
      next.currentPassword = i18n.t('password:errors.currentRequired');
    }

    if (!newPassword) {
      next.newPassword = i18n.t('password:errors.newRequired');
    } else if (newPassword.length < PASSWORD_MIN_LENGTH) {
      next.newPassword = i18n.t('password:errors.newTooShort', { count: PASSWORD_MIN_LENGTH });
    } else if (newPassword.length > PASSWORD_MAX_LENGTH) {
      next.newPassword = i18n.t('password:errors.newTooLong', { count: PASSWORD_MAX_LENGTH });
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      next.newPassword = i18n.t('password:errors.sameAsCurrent');
    }

    return Object.keys(next).length > 0 ? next : null;
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const currentPassword = fields.currentPassword.value;
    const newPassword = fields.newPassword.value;

    const validationErrors = validateClientSide(currentPassword, newPassword);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    api.password.edit({
      currentPassword,
      password: newPassword,
    })
      .then(() => {
        setSubmitting(false);
        resetForm();
        alertSuccess(i18n.t('password:success'));
      })
      .catch((err) => {
        setSubmitting(false);

        // The server returns 401 specifically when the current
        // password doesn't match — surface that on the relevant field
        // rather than as a generic toast.
        const status = err && err.response && err.response.status;
        if (status === 401) {
          setErrors({ currentPassword: i18n.t('password:errors.currentIncorrect') });
          return;
        }

        // 400 means the server rejected the payload — usually because
        // the new password failed validation (length). Re-run client
        // validation to put the message on the right field; fall back
        // to a toast if nothing specific lit up.
        if (status === 400) {
          const serverErrors = validateClientSide(currentPassword, newPassword);
          if (serverErrors) {
            setErrors(serverErrors);
            return;
          }
        }

        alertError(i18n.t('password:errors.generic'));
      });
  };

  return (
    <PasswordEdit
      fields={fields}
      errors={errors}
      submitting={submitting}
      showNewPassword={showNewPassword}
      onChange={handleOnChange}
      onSubmit={handleOnSubmit}
      onToggleVisibility={handleToggleVisibility}
    />
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
