import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import DialogConfirm from '../../../components/DialogConfirm';

const useStyles = makeStyles((theme) => {
  return {
    deleteMenuItem: {
      color: theme.palette.error.main,
    },
    deleteIcon: {
      color: theme.palette.error.main,
    },
  };
});

const OAuthClientMenu = ({
  client,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(client);
  };

  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        aria-label="actions"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        {canEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
        )}
        {canDelete && (
          <DialogConfirm
            title="Delete OAuth Client"
            message={`Are you sure you want to delete "${client.name}"? This cannot be undone and will revoke all associated tokens.`}
            confirm="Delete"
          >
            <MenuItem
              className={classes.deleteMenuItem}
              onClick={() => {
                handleClose();
                onDelete(client.id);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" className={classes.deleteIcon} />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
          </DialogConfirm>
        )}
      </Menu>
    </>
  );
};

OAuthClientMenu.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OAuthClientMenu;
