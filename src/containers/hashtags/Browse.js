import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
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
    browseHashtags,
    resetHashtags,
    hashtags,
    error,
    hasMore,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseHashtags({
      start,
      limit: LIMIT,
      ...queryFilters,
    });
  };

  useEffect(() => {
    return () => {
      resetHashtags();
    };
  }, []);

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
        {hashtags.allIds.map((hashtagId) => {
          const hashtag = hashtags.byId[hashtagId];
          return (
            <React.Fragment key={`hashtag_list_item_container_${hashtag.id}`}>
              <ListItem
                key={`hashtag_list_item_${hashtag.id}`}
                href={`/hashtags/${hashtag.alias}/`}
                button
                component="a"
              >
                <ListItemAvatar>
                  <Avatar>
                    #
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={hashtag.name} />
              </ListItem>
              <Divider
                component="li"
                light
                key={`hashtag_list_divider_${hashtag.id}`}
              />
            </React.Fragment>
          );
        })}
      </InfiniteScroll>
    </List>
  );
};

HashtagsBrowse.propTypes = {
  browseHashtags: PropTypes.func.isRequired,
  resetHashtags: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  hashtags: HashtagsType.isRequired,
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
    hashtags,
    error,
    isFetching,
    hasMore,
  } = state.hashtags;

  return {
    hashtags,
    error,
    isFetching,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseHashtags: (params) => {
      return dispatch(actions.browse(params));
    },
    resetHashtags: () => {
      return dispatch(actions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashtagsBrowse);
