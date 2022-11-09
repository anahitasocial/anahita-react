import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import NodeType from '../../../proptypes/Node';
import utils from '../../../utils';
import i18n from '../../../languages';

const { getActorInitials } = utils.node;

const styles = (theme) => {
  return {
    largeAvatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      fontSize: 48,
    },
    smallAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: 12,
    },
    defaultAvatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      fontSize: 20,
    },
    avatar: {
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.background.paper,
      borderWidth: 4,
      borderStyle: 'solid',
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
    node,
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

  const initials = getActorInitials(node);

  return (
    <>
      <IconButton
        color="primary"
        component="span"
        className={classes.button}
        disabled={!canEdit || isFetching}
        onClick={handleOpen}
      >
        <Avatar
          aria-label={node.name}
          className={clsx(classes[`${size}Avatar`], classes.avatar)}
          alt={node.name}
          src={isFetching ? '' : avatar}
        >
          {!isFetching && !avatar && initials}
          {isFetching && <CircularProgress />}
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
            {i18n.t('actions:update')}
          </label>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          {i18n.t('actions:delete')}
        </MenuItem>
      </Menu>
    </>
  );
};

ActorAvatarForm.propTypes = {
  classes: PropTypes.object.isRequired,
  node: NodeType.isRequired,
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
  avatar: '',
  anchorEl: null,
  size: 'default',
};

export default withStyles(styles)(ActorAvatarForm);
