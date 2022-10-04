import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import InfiniteScroll from 'react-infinite-scroll-component';

import actions from '../../actions';
import NodesType from '../../proptypes/Nodes';

import CommentCard from '../../components/cards/Comment';
import ActorsCard from '../actors/browse/Card';
import Masonry from '../../components/BreakpointMasonry';
import MediaCard from '../nodes/cards/Medium';
import Progress from '../../components/Progress';
import { App as APP, Search as SEARCH } from '../../constants';

import utils from '../../utils/node';

const { LIMIT } = APP.BROWSE;

const {
  RELEVANT,
  RECENT,
} = SEARCH.SORTING;

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
  };
});

const SearchBrowse = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    alertError,
    items,
    error,
    hasMore,
    isFetching,
    queryParams: {
      sort,
      q,
      scope,
      coordLong,
      coordLat,
      searchRange,
      searchComments,
    },
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
        sort,
        start,
        scope,
        search_range: searchRange <= 100 ? searchRange : '',
        search_comments: searchComments,
        coord_lng: searchRange <= 100 ? coordLong : '',
        coord_lat: searchRange <= 100 ? coordLat : '',
        limit: LIMIT,
        term: q,
      });
    }
  }, [
    sort,
    start,
    scope,
    searchRange,
    searchComments,
    searchRange,
    coordLong,
    coordLat,
  ]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <InfiniteScroll
      dataLength={items.allIds.length}
      next={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="items-progress" />
      }
    >
      <Masonry>
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          const key = `search_node_${node.id}`;
          return (
            <div key={key} className={classes.card}>
              {utils.isActor(node) &&
                <ActorsCard actor={node} />}
              {utils.isMedium(node) &&
                <MediaCard medium={node} />}
              {utils.isComment(node) &&
                <CommentCard comment={node} />}
            </div>
          );
        })}
      </Masonry>
    </InfiniteScroll>
  );
};

const mapStateToProps = (state) => {
  const {
    search: items,
    error,
    hasMore,
    isFetching,
  } = state.search;

  return {
    items,
    error,
    hasMore,
    isFetching,
  };
};

SearchBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: NodesType.isRequired,
  queryParams: PropTypes.shape({
    sort: PropTypes.oneOf([RELEVANT, RECENT]),
    q: PropTypes.string,
    scope: PropTypes.string,
    searchRange: PropTypes.number,
    searchComments: PropTypes.bool,
    coordLong: PropTypes.number,
    coordLat: PropTypes.number,
  }).isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.search.browse(params));
    },
    resetList: () => {
      return dispatch(actions.search.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBrowse);
