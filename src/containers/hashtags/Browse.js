import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import Progress from '../../components/Progress';

import HashtagsType from '../../proptypes/Hashtags';

import actions from '../../actions';
import { App as APP } from '../../constants';

const {
  LIMIT,
  SORTING: {
    TRENDING,
  },
} = APP.BROWSE;

const HashtagsBrowse = (props) => {
  const {
    browseList,
    resetList,
    alertError,
    items,
    error,
    hasMore,
    isFetching,
    queryFilters,
  } = props;

  const [start, setStart] = useState(0);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    if (!isFetching) {
      browseList({
        start,
        limit: LIMIT,
        ...queryFilters,
      });
    }
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
              href={`/hashtags/${node.alias}/`}
              button
              component="a"
              divider
            >
              <ListItemAvatar>
                <Avatar>
                  #
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={node.name} />
            </ListItem>
          );
        })}
      </InfiniteScroll>
    </List>
  );
};

HashtagsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  items: HashtagsType.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

HashtagsBrowse.defaultProps = {
  queryFilters: {
    q: '',
    sort: TRENDING,
  },
};

const mapStateToProps = (state) => {
  const {
    hashtags: items,
    error,
    isFetching,
    hasMore,
  } = state.hashtags;

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
      return dispatch(actions.hashtags.browse(params));
    },
    resetList: () => {
      return dispatch(actions.hashtags.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashtagsBrowse);
