import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';

import ActorAvatar from '../../components/actor/Avatar';
import Progress from '../../components/Progress';
import NotificationMessage from '../../components/cards/NotificationMessage';

import NotificationsType from '../../proptypes/Notifications';

import actions from '../../actions';
import { App as APP } from '../../constants';

const {
  LIMIT,
} = APP.BROWSE;

const NotificationsBrowse = (props) => {
  const {
    browseList,
    resetList,
    editItem,
    deleteItem,
    successAlert,
    alertError,
    items,
    error,
    total,
  } = props;

  const [start, setStart] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    browseList({
      start,
      limit: LIMIT,
    });
  }, [start]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  const handleEdit = (item) => {
    if (!item.isRead) {
      editItem(item).then(() => {
        successAlert('Notification marked as read');
      });
    }
  };

  const handleDelete = (item) => {
    deleteItem(item).then(() => {
      successAlert('Notification deleted');
    });
  };

  const hasMore = total > items.allIds.length;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <NotificationsIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6">Notifications</Typography>
        }
      />
      <List id="scrollableDiv">
        <InfiniteScroll
          dataLength={items.allIds.length}
          next={fetchList}
          hasMore={hasMore}
          loader={<Progress key="items-progress" />}
        >
          {items.allIds.map((itemId) => {
            const item = items.byId[itemId];
            return (
              <ListItem
                key={`node_list_item_${item.id}`}
                divider
              >
                <ListItemAvatar>
                  <ActorAvatar
                    actor={item.subject}
                    linked={Boolean(item.subject.id)}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <NotificationMessage notification={item} />
                  }
                  secondary={moment.utc(item.creationTime).fromNow()}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="actions"
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedItem(item);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedItem && selectedItem.id === item.id}
                    onClose={() => {
                      return setAnchorEl(null);
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        return handleEdit(item);
                      }}
                      disabled={item.isRead}
                    >
                      Mark as read
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        return handleDelete(item);
                      }}
                    >
                      Delete notification
                    </MenuItem>
                  </Menu>
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={item.isRead}
                    style={{
                      marginLeft: 24,
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </InfiniteScroll>
      </List>
    </Card>
  );
};

NotificationsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  successAlert: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: NotificationsType.isRequired,
  error: PropTypes.string.isRequired,
  total: PropTypes.number,
};

NotificationsBrowse.defaultProps = {
  total: 0,
};

const mapStateToProps = (state) => {
  const {
    notifications: items,
    error,
    total,
    isFetching,
  } = state.notifications;

  return {
    items,
    error,
    total,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.notifications.browse(params));
    },
    resetList: () => {
      return dispatch(actions.notifications.reset());
    },
    editItem: (item) => {
      return dispatch(actions.notifications.edit(item));
    },
    deleteItem: (item) => {
      return dispatch(actions.notifications.deleteItem(item));
    },
    successAlert: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsBrowse);
