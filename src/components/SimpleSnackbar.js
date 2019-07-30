import React from 'react';
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
    close: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    message: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    icon: {
      verticalAlign: 'middle',
    },
  };
};

class SimpleSnackbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.isOpen,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  renderMessage() {
    const { type, message, classes } = this.props;
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
  }

  render() {
    const { classes, autoHideDuration } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          direction="up"
          open={this.state.open}
          autoHideDuration={autoHideDuration}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={this.renderMessage()}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

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
