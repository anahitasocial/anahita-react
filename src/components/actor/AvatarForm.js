import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => {
  return {
    largeAvatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    smallAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    defaultAvatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    avatar: {
      borderSize: 3,
      borderStyle: 'solid',
      borderColor: theme.palette.background.paper,
    },
    button: {
      position: 'relative',
      width: theme.spacing(15),
      height: theme.spacing(15),
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
    canEdit,
    handleOpen,
    handleClose,
    handleFieldChange,
    handleDelete,
    size,
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
        <Avatar
          aria-label={name}
          className={clsx(classes[`${size}Avatar`], classes.avatar)}
          alt={name}
          src={isFetching ? '' : avatar}
        >
          {!isFetching &&
            name.charAt(0)
          }
          {isFetching &&
            <CircularProgress />
          }
        </Avatar>
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
            Upload Avatar
          </label>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

ActorAvatarForm.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  avatar: PropTypes.string,
  anchorEl: PropTypes.object,
  isFetching: PropTypes.bool,
  canEdit: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'large', 'default']),
};

ActorAvatarForm.defaultProps = {
  isFetching: false,
  canEdit: false,
  name: '',
  avatar: '',
  anchorEl: null,
  size: 'default',
};

export default withStyles(styles)(ActorAvatarForm);
