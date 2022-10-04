import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import InfiniteScroll from 'react-infinite-scroll-component';

import actions from '../../actions';
import NodeType from '../../proptypes/Node';
import NodesType from '../../proptypes/Nodes';

import CommentCard from '../../components/cards/Comment';
import ActorsCard from '../actors/browse/Card';
import Masonry from '../../components/BreakpointMasonry';
import MediaCard from '../nodes/cards/Medium';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

import utils from '../../utils/node';

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

const TaggablesBrowse = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    alertError,
    tag,
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
      resetList(tag);
    };
  }, [tag]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  useEffect(() => {
    if (!isFetching) {
      browseList(tag, {
        tag,
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
    taggables: items,
    error,
    hasMore,
    isFetching,
  } = state.taggables;

  return {
    items,
    error,
    hasMore,
    isFetching,
  };
};

TaggablesBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  tag: NodeType.isRequired,
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
    browseList: (tag, params) => {
      return dispatch(actions.taggables(tag).browse(params));
    },
    resetList: (tag) => {
      return dispatch(actions.taggables(tag).reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaggablesBrowse);
