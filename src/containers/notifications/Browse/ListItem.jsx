import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import ActorAvatar from '../../../components/actor/Avatar';
import NotificationMessage from '../../../components/cards/NotificationMessage';

import NotificationType from '../../../proptypes/Notification';

const NotificationListItem = ({ item, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <ListItem divider>
      <ListItemAvatar>
        <ActorAvatar
          actor={item.subject}
          linked={Boolean(item.subject.id)}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<NotificationMessage notification={item} />}
        secondary={moment.utc(item.creationTime).fromNow()}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="actions"
          onClick={(event) => {
            return setAnchorEl(event.currentTarget);
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            return setAnchorEl(null);
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleEdit(item);
            }}
            disabled={item.isRead}
          >
            Mark as read
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleDelete(item);
            }}
          >
            Delete notification
          </MenuItem>
        </Menu>
        <Badge
          color="primary"
          variant="dot"
          invisible={item.isRead}
          style={{ marginLeft: 24 }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

NotificationListItem.propTypes = {
  item: NotificationType.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default NotificationListItem;
