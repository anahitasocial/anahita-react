import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import InfiniteScroll from 'react-infinite-scroll-component';

import actions from '../../actions';
import NodesType from '../../proptypes/Nodes';

import Masonry from '../../components/BreakpointMasonry';
import MediaCard from '../nodes/cards/Medium';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const {
  LIMIT,
  SORTING: {
    TOP,
    RECENT,
  },
} = APP.BROWSE;

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
  };
});

const BlogsBrowse = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    alertError,
    items,
    error,
    hasMore,
    isFetching,
    queryFilters: {
      sort,
    },
  } = props;

  const [start, setStart] = useState(0);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  useEffect(() => {
    if (!isFetching) {
      browseList({
        sort,
        start,
        limit: LIMIT,
      });
    }
  }, [start]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

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
          const key = `node_${node.id}`;
          return (
            <div key={key} className={classes.card}>
              <MediaCard medium={node} />
            </div>
          );
        })}
      </Masonry>
    </InfiniteScroll>
  );
};

const mapStateToProps = (state) => {
  const {
    blogs: items,
    error,
    hasMore,
    isFetching,
  } = state.blogs;

  return {
    items,
    error,
    hasMore,
    isFetching,
  };
};

BlogsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: NodesType.isRequired,
  queryFilters: PropTypes.shape({
    sort: PropTypes.oneOf([TOP, RECENT]),
    q: PropTypes.string,
  }).isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.blogs.browse(params));
    },
    resetList: () => {
      return dispatch(actions.blogs.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlogsBrowse);
