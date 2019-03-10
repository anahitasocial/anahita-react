import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => {
  return {
    avatar: {
      width: theme.spacing.unit * 15,
      height: theme.spacing.unit * 15,
    },
    button: {
      position: 'relative',
      width: theme.spacing.unit * 15,
      height: theme.spacing.unit * 15,
      zIndex: 1,
    },
    input: {
      display: 'none',
    },
  };
};

const ActorAvatarForm = (props) => {
  const {
    classes,
    name,
    avatar,
    anchorEl,
    isFetching,
    isAvatarLoaded,
    isWaiting,
    canEdit,
    hasAvatar,
    handleOpen,
    handleClose,
    handleFieldChange,
    handleDelete,
  } = props;

  return (
    <React.Fragment>
      <IconButton
        color="primary"
        component="span"
        className={classes.button}
        disabled={!canEdit || isFetching}
        onClick={handleOpen}
      >
        {hasAvatar &&
          <Avatar
            aria-label={name}
            className={classes.avatar}
            alt={name}
            src={isAvatarLoaded ? avatar.src : ''}
          >
            {isWaiting &&
              <CircularProgress />
            }
          </Avatar>
        }
        {!hasAvatar &&
          <Avatar
            aria-label={name}
            className={classes.avatar}
            alt={name}
            src={isAvatarLoaded ? avatar.src : ''}
          >
            {!isWaiting &&
              name.charAt(0)
            }
            {isWaiting &&
              <CircularProgress />
            }
          </Avatar>
        }
      </IconButton>

      <Menu
        id="avatar-add-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <label htmlFor="selectAvatarFile">
            <input
              accept="image/*"
              className={classes.input}
              id="selectAvatarFile"
              type="file"
              disabled={!canEdit || isFetching}
              onChange={handleFieldChange}
            />
            {'Upload Avatar'}
          </label>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          {'Delete'}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

ActorAvatarForm.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  avatar: PropTypes.object,
  anchorEl: PropTypes.object,
  isFetching: PropTypes.bool,
  isAvatarLoaded: PropTypes.bool,
  isWaiting: PropTypes.bool,
  hasAvatar: PropTypes.bool,
  canEdit: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

ActorAvatarForm.defaultProps = {
  isFetching: false,
  canEdit: false,
  hasAvatar: false,
  name: '',
  avatar: {
    src: '',
  },
  isAvatarLoaded: false,
  isWaiting: false,
  anchorEl: null,
};

export default withStyles(styles)(ActorAvatarForm);
