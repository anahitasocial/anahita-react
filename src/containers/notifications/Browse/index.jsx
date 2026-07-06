import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import NotificationsIcon from '@material-ui/icons/Notifications';

import NotificationsList from './List';

import NotificationsType from '../../../proptypes/Notifications';

import actions from '../../../actions';
import { App as APP } from '../../../constants';

const {
  LIMIT,
} = APP.BROWSE;

const NotificationsBrowse = ({
  browseList,
  resetList,
  editItem,
  deleteItem,
  successAlert,
  alertError,
  items,
  error,
  total = 0,
}) => {
  const [start, setStart] = useState(0);

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
    setStart(start + LIMIT);
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

  return (
    <Container maxWidth="md">
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
        <NotificationsList
          items={items}
          total={total}
          fetchList={fetchList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Card>
    </Container>
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
    setAppTitle: (title) => {
      return dispatch(actions.app.setAppTitle(title));
    },
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
