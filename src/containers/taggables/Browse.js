import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import NodesType from '../../proptypes/Nodes';

import CommentCard from '../../components/cards/Comment';
import ActorsCard from '../actors/Card';
import Masonry from '../../components/BreakpointMasonry';
import MediaCard from '../media/Card';
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
    tag,
    items,
    error,
    hasMore,
    queryFilters: {
      sort,
    },
  } = props;

  useEffect(() => {
    return () => {
      resetList(tag);
    };
  }, [resetList]);

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseList(tag, {
      tag,
      sort,
      start,
      limit: LIMIT,
    });
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
      loadMore={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="taggables-progress" />
      }
    >
      <Masonry>
        {items.allIds.map((itemId) => {
            const node = items.byId[itemId];
            const key = `node_${node.id}`;
            const namespace = node.objectType.split('.')[1];
            return (
              <div key={key} className={classes.card}>
                {utils.isActor(node) &&
                  <ActorsCard actor={node} />
                }
                {utils.isMedium(node) &&
                  <MediaCard
                    medium={node}
                    namespace={namespace}
                  />
                }
                {utils.isComment(node) &&
                  <CommentCard
                    comment={node}
                  />
                }
              </div>
            );
          })
        }
      </Masonry>
    </InfiniteScroll>
  );
};

const mapStateToProps = (state) => {
  const {
    taggables: items,
    error,
    hasMore,
  } = state.taggables;

  return {
    items,
    error,
    hasMore,
  };
};

TaggablesBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  tag: NodeType.isRequired,
  items: NodesType.isRequired,
  queryFilters: PropTypes.shape({
    sort: PropTypes.oneOf([TOP, RECENT]),
    q: PropTypes.string,
  }).isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (tag, params) => {
      return dispatch(actions.taggables(tag).browse(params));
    },
    resetList: (tag) => {
      return dispatch(actions.taggables(tag).reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaggablesBrowse);
