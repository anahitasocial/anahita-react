import React, { cloneElement, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import i18n from '../languages';

const DialogConfirm = (props) => {
  const {
    children,
    title,
    message,
  } = props;

  const [open, setOpen] = useState(false);

  const childrenWithProps = React.Children.map(children, (child) => {
    return cloneElement(child, {
      onClick: (e) => {
        e.preventDefault();
        setOpen(true);
      },
    });
  });

  const handleClose = () => {
    return setOpen(false);
  };

  const handleConfirm = () => {
    children.props.onClick();
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            fullWidth
          >
            {i18n.t('actions:cancel')}
          </Button>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleConfirm}
          >
            {i18n.t('actions:confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      {childrenWithProps}
    </>
  );
};

DialogConfirm.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string,
  title: PropTypes.string,
};

DialogConfirm.defaultProps = {
  title: i18n.t('prompts:confirm.title'),
  message: i18n.t('prompts:confirm.delete'),
};

export default DialogConfirm;
