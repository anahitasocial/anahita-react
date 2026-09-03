import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import form from '../../../utils/form';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';

import EmailEdit from './EmailEdit';
import StepUp from '../StepUp';
import { Email as EMAIL_LIMITS } from '../../../constants';

const { EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH } = EMAIL_LIMITS;

const formFields = form.createFormFields([
  'email',
]);

// Change-email card for Settings → Account.
//
// This is the ONLY way an account's email address changes. The person
// edit form no longer accepts one — from admins or from the person
// themselves — because email is what password reset delivers to, so
// whoever can set it can take the account.
//
// Submitting does not change anything yet. It mails a confirmation link
// to the person's CURRENT address, and the change applies only once
// they open it and re-type the new address.
//
// Two independent proofs in total: a recent step-up (a passkey, or a
// password plus a passcode, or a password) and control of the existing
// inbox. The step-up is collected by the dialog on a 403, not by this
// form — see containers/auth/StepUp.
const Email = ({
  viewer,
  alertError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [stepUpOpen, setStepUpOpen] = useState(false);

  const resetForm = () => {
    setFields(formFields);
    setErrors({});
  };

  const handleOpen = () => {
    // Clear the "check your inbox" notice when reopening — it describes
    // a previous request, not the one about to be made.
    setSent(false);
    resetForm();
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleOnChange = (event) => {
    const { target } = event;
    const { name } = target;

    setFields(form.validateField(target, fields));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateClientSide = (newEmail) => {
    const next = {};

    if (!newEmail) {
      next.email = i18n.t('email:errors.required');
    } else if (newEmail.length < EMAIL_MIN_LENGTH || newEmail.length > EMAIL_MAX_LENGTH) {
      next.email = i18n.t('email:errors.invalid');
    } else if (!newEmail.includes('@')) {
      next.email = i18n.t('email:errors.invalid');
    } else if (newEmail.toLowerCase() === (viewer.email || '').toLowerCase()) {
      next.email = i18n.t('email:errors.sameAsCurrent');
    }

    return Object.keys(next).length > 0 ? next : null;
  };

  // submit is separate from handleOnSubmit so the step-up dialog can
  // replay it after a successful re-authentication, without the person
  // having to press the button again.
  const submit = () => {
    const newEmail = fields.email.value.trim();

    setSubmitting(true);

    api.email.edit({ email: newEmail })
      .then(() => {
        setSubmitting(false);
        resetForm();
        setIsEditing(false);
        setSent(true);
      })
      .catch((err) => {
        setSubmitting(false);

        const status = err && err.response && err.response.status;

        // No recent step-up. Collect one, then retry.
        if (status === 403) {
          setStepUpOpen(true);
          return;
        }

        // No 429 branch. /email/change carries no rate-limit scope, and
        // does not need one: clearStepUp runs on every successful
        // request, so each retry costs a fresh re-authentication. That
        // is the throttle. A branch for a status the server never sends
        // is a message nobody can trigger and nobody maintains.

        // Safe to be specific: this endpoint already required a session
        // and a step-up, so it is not an enumeration oracle for whether
        // an address is registered.
        if (status === 409) {
          setErrors({ email: i18n.t('email:errors.taken') });
          return;
        }

        if (status === 400) {
          setErrors({ email: i18n.t('email:errors.invalid') });
          return;
        }

        alertError(i18n.t('email:errors.generic'));
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationErrors = validateClientSide(fields.email.value.trim());
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    submit();
  };

  return (
    <>
      <EmailEdit
        currentEmail={viewer.email || ''}
        isEditing={isEditing}
        fields={fields}
        errors={errors}
        submitting={submitting}
        sent={sent}
        onOpen={handleOpen}
        onCancel={handleCancel}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
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

Email.propTypes = {
  viewer: PropTypes.objectOf(PropTypes.any).isRequired,
  alertError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  return { viewer };
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
