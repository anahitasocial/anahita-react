import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import InfiniteScroll from 'react-infinite-scroller';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Progress from '../../components/Progress';

import HashtagsType from '../../proptypes/Hashtags';

import { hashtags as actions } from '../../actions';
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
    items,
    error,
    hasMore,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseList({
      start,
      limit: LIMIT,
      ...queryFilters,
    });
  };

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <List>
      <InfiniteScroll
        loadMore={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key="hashtags-progress" />
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
  queryFilters: PropTypes.object,
  items: HashtagsType.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
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
      return dispatch(actions.browse(params));
    },
    resetList: () => {
      return dispatch(actions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashtagsBrowse);
