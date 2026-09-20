import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import i18n from '../../../languages';
import utils from '../../../utils';

const { form } = utils;

const FIELDS = ['email'];

// Sends one invitation.
//
// An address and nothing else, because that is the whole request:
// auth-service's InviteAdd carries a single Email field. There is no
// message to compose — the mail is a template naming the inviter, and a
// free-text box here would imply otherwise.
//
// The length bounds are the server's own, min=10 and max=100 on an
// `email` validator. Mirrored onto the input so a refusal arrives as a
// message under the field rather than as a bare 400.
const InviteForm = ({
  open,
  onClose,
  onSave,
}) => {
  const [fields, setFields] = useState(() => {
    return form.createFormFields(FIELDS, { email: '' });
  });
  const [submitting, setSubmitting] = useState(false);

  // Cleared on open, so an address that was refused last time is not
  // sitting there to be sent again by accident.
  useEffect(() => {
    if (open) {
      setFields(form.createFormFields(FIELDS, { email: '' }));
    }
  }, [open]);

  const handleChange = (event) => {
    const { target } = event;
    setFields((previous) => {
      return form.validateField(target, previous, ['email']);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validated = form.validateForm(event.target, fields);
    setFields(validated);

    if (!form.isValid(validated)) {
      return;
    }

    const { email } = form.fieldsToData(validated);

    setSubmitting(true);

    Promise.resolve(onSave(email.trim()))
      .catch(() => {
        // Reported by the page, which keeps this dialog open with the
        // address intact.
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const { email } = fields;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{i18n.t('invites:form.cTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            {i18n.t('invites:form.cDescription')}
          </DialogContentText>
          <TextField
            name="email"
            type="email"
            label={i18n.t('invites:fields.recipientEmail')}
            value={email.value}
            onChange={handleChange}
            error={Boolean(email.error)}
            helperText={email.error}
            fullWidth
            required
            autoFocus
            inputProps={{
              minLength: 10,
              maxLength: 100,
              autoCapitalize: 'none',
              autoCorrect: 'off',
              spellCheck: 'false',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={onClose} disabled={submitting}>
            {i18n.t('commons:dismiss')}
          </Button>
          <Button
            fullWidth
            type="submit"
            color="primary"
            variant="contained"
            disabled={submitting}
          >
            {i18n.t('invites:actions.send')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

InviteForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default InviteForm;
