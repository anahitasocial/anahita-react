import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';

const styles = (theme) => {
  return {
    message: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    icon: {
      verticalAlign: 'middle',
    },
  };
};

const SimpleSnackbar = (props) => {
  const {
    classes,
    message,
    isOpen,
    type,
    autoHideDuration,
  } = props;

  const [open, setOpen] = useState(isOpen);

  const handleClose = () => {
    setOpen(false);
  };

  const renderMessage = () => {
    return (
      <React.Fragment>
        {type === 'warning' &&
          <WarningIcon className={classes.icon} color="secondary" />
        }
        {type === 'info' &&
          <InfoIcon className={classes.icon} color="inherit" />
        }
        {type === 'success' &&
          <SuccessIcon className={classes.icon} color="primary" />
        }
        {type === 'error' &&
          <ErrorIcon className={classes.icon} color="error" />
        }
        <span className={classes.message}>
          {message}
        </span>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        direction="up"
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={renderMessage()}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
};

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  autoHideDuration: PropTypes.number,
};

SimpleSnackbar.defaultProps = {
  isOpen: false,
  type: 'info',
  autoHideDuration: 3000,
};

export default withStyles(styles)(SimpleSnackbar);
