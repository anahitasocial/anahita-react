import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import form from '../../../utils/form';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';

import UsernameEdit from './UsernameEdit';
import StepUp from '../StepUp';
import { Username as USERNAME } from '../../../constants';

const {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
} = USERNAME;

const formFields = form.createFormFields([
  'username',
]);

// Change-username card for Settings.
//
// This is the ONLY way an account's handle changes. The person edit
// endpoint in person-service ignores a username field entirely — it
// assigns given name, family name, body and gender and nothing else —
// so the field that used to sit in the Account form was writing
// nowhere.
//
// Unlike the email card beside it, submitting changes the handle
// immediately. There is no confirmation link because a handle move
// relocates no recovery path: password reset still delivers to the same
// inbox. The proof required is a recent step-up, collected by the dialog
// on a 403 — see containers/auth/StepUp — and the person is mailed a
// notification afterwards, which is how an impersonation attempt
// surfaces.
const Username = ({
  viewer,
  alertError,
  alertSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [stepUpOpen, setStepUpOpen] = useState(false);

  // Held locally rather than read from the store on every render. The
  // session viewer is not refreshed by this request, so after a
  // successful change the store still carries the old handle and the
  // card would claim nothing had happened.
  const [currentUsername, setCurrentUsername] = useState(viewer.username || '');

  const resetForm = () => {
    setFields(formFields);
    setErrors({});
  };

  const handleOpen = () => {
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

  // Length and character set are checked here so the person is told
  // WHICH rule they broke. The server answers a failed format check with
  // a bare 400, which cannot distinguish "too short" from "has a space".
  const validateClientSide = (newUsername) => {
    const next = {};

    if (!newUsername) {
      next.username = i18n.t('username:errors.required');
    } else if (newUsername.length < USERNAME_MIN_LENGTH) {
      next.username = i18n.t('username:errors.tooShort', { count: USERNAME_MIN_LENGTH });
    } else if (newUsername.length > USERNAME_MAX_LENGTH) {
      next.username = i18n.t('username:errors.tooLong', { count: USERNAME_MAX_LENGTH });
    } else if (!USERNAME_PATTERN.test(newUsername)) {
      next.username = i18n.t('username:errors.invalid');
    } else if (newUsername.toLowerCase() === currentUsername.toLowerCase()) {
      // Case-insensitive, matching the server's EqualFold no-op check.
      // Without it, restyling your own capitalisation would send a
      // request the server answers 204 to, and the card would report a
      // change that did not happen.
      next.username = i18n.t('username:errors.sameAsCurrent');
    }

    return Object.keys(next).length > 0 ? next : null;
  };

  // Separate from handleOnSubmit so the step-up dialog can replay it
  // after a successful re-authentication.
  const submit = () => {
    const newUsername = fields.username.value.trim();

    setSubmitting(true);

    api.username.edit({ username: newUsername })
      .then((response) => {
        setSubmitting(false);
        resetForm();
        setIsEditing(false);

        // 200 carries the STORED handle, which differs from what was
        // typed by the trim; 204 means the server treated it as a no-op
        // and nothing moved. Falling back to newUsername would be wrong
        // in the 204 case, so fall back to what is already displayed.
        const stored = (response && response.data && response.data.username)
          || currentUsername;

        setCurrentUsername(stored);
        alertSuccess(i18n.t('username:changed', { username: stored }));
      })
      .catch((err) => {
        setSubmitting(false);

        const status = err && err.response && err.response.status;

        // No recent step-up. Collect one, then retry.
        if (status === 403) {
          setStepUpOpen(true);
          return;
        }

        // Safe to be specific. Username availability is public by
        // construction — a profile address either resolves or does not —
        // so naming the conflict reveals nothing a visit would not.
        if (status === 409) {
          setErrors({ username: i18n.t('username:errors.taken') });
          return;
        }

        if (status === 400) {
          setErrors({ username: i18n.t('username:errors.invalid') });
          return;
        }

        alertError(i18n.t('username:errors.generic'));
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const validationErrors = validateClientSide(fields.username.value.trim());
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    submit();
  };

  return (
    <>
      <UsernameEdit
        currentUsername={currentUsername}
        isEditing={isEditing}
        fields={fields}
        errors={errors}
        submitting={submitting}
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

Username.propTypes = {
  viewer: PropTypes.objectOf(PropTypes.any).isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
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
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Username);
