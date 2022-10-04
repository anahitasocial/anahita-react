import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import ActorAvatar from '../../components/actor/Avatar';
import Progress from '../../components/Progress';
import StoryMessage from '../../components/cards/story/StoryMessage';

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
    alertError,
    items,
    error,
    hasMore,
  } = props;

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
    return setStart(start + LIMIT);
  };

  return (
    <List>
      <InfiniteScroll
        dataLength={items.allIds.length}
        next={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key="items-progress" />
        }
      >
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          return (
            <ListItem
              key={`node_list_item_${node.id}`}
              divider
            >
              <ListItemAvatar>
                <ActorAvatar
                  actor={node.subject}
                  linked={Boolean(node.subject.id)}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <StoryMessage story={node} />
                }
                secondary={moment.utc(node.creationTime).fromNow()}
              />
            </ListItem>
          );
        })}
      </InfiniteScroll>
    </List>
  );
};

NotificationsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: NotificationsType.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    notifications: items,
    error,
    isFetching,
    hasMore,
  } = state.notifications;

  return {
    items,
    error,
    isFetching,
    hasMore,
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
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsBrowse);
