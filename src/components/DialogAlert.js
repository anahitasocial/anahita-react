import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogAlert = (props) => {
  const {
    title,
    content,
    confirm,
    dismiss,
    handleConfirm,
    handleDismiss,
    open,
  } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDismiss}
          fullWidth
        >
          {dismiss}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          autoFocus
          fullWidth
          variant="contained"
        >
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogAlert.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  confirm: PropTypes.string,
  dismiss: PropTypes.string,
  handleConfirm: PropTypes.func.isRequired,
  handleDismiss: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

DialogAlert.defaultProps = {
  confirm: 'Confirm',
  dismiss: 'Dismiss',
  open: false,
};

export default DialogAlert;
