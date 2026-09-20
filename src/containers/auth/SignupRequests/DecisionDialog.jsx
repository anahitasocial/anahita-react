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
import SignupRequestType from '../../../proptypes/SignupRequest';

// Confirms an approval or a rejection, and collects the note that goes
// with it.
//
// Both decisions are final — neither endpoint has an undo, and each one
// sends the applicant mail — so both are confirmed rather than only the
// rejection. Approving also creates a real account with a real
// username, which is not something to do on a stray click in a table.
//
// The note is optional and is stored against the decision for the
// record. It is NOT shown to the applicant: the mail they receive says
// they were approved or refused and nothing more, so an administrator
// can write plainly here without composing a message.
const DecisionDialog = ({
  deciding = null,
  submitting = false,
  onClose,
  onConfirm,
}) => {
  const [note, setNote] = useState('');

  // Cleared whenever the dialog opens on a different request, so a note
  // typed for one applicant is never carried onto another's decision.
  useEffect(() => {
    setNote('');
  }, [deciding]);

  if (!deciding) {
    return null;
  }

  const { request, decision } = deciding;
  const approving = decision === 'approve';

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {approving ?
          i18n.t('signupRequests:confirmApprove.cTitle') :
          i18n.t('signupRequests:confirmReject.cTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          {approving ?
            i18n.t('signupRequests:confirmApprove.cDescription', {
              username: request.username,
              email: request.email,
            }) :
            i18n.t('signupRequests:confirmReject.cDescription', {
              username: request.username,
            })}
        </DialogContentText>
        <TextField
          name="note"
          label={i18n.t('signupRequests:fields.note')}
          helperText={i18n.t('signupRequests:form.noteHint')}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
          }}
          fullWidth
          multiline
          minRows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button fullWidth onClick={onClose} disabled={submitting}>
          {i18n.t('commons:dismiss')}
        </Button>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          disabled={submitting}
          onClick={() => {
            onConfirm(note);
          }}
        >
          {approving ?
            i18n.t('signupRequests:actions.approve') :
            i18n.t('signupRequests:actions.reject')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DecisionDialog.propTypes = {
  deciding: PropTypes.shape({
    request: SignupRequestType.isRequired,
    decision: PropTypes.oneOf(['approve', 'reject']).isRequired,
  }),
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DecisionDialog;
