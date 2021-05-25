import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import InfiniteScroll from 'react-infinite-scroller';

import actions from '../../actions';

import ActorType from '../../proptypes/Actor';
import ActorsType from '../../proptypes/Actors';
import ActorsCard from './browse/Card';
import Masonry from '../../components/BreakpointMasonry';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
  };
});

const ActorsSocialgraph = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    items,
    actorNode,
    hasMore,
    filter,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    const { q } = queryFilters;
    browseList({
      q,
      filter,
      actor: actorNode,
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

  return (
    <React.Fragment>
      <InfiniteScroll
        loadMore={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key="socialgragh-progress" />
        }
      >
        <Masonry>
          {items.allIds.map((itemId) => {
            const node = items.byId[itemId];
            const key = `socialgraph_node_${node.id}`;
            return (
              <div
                className={classes.card}
                key={key}
              >
                <ActorsCard actor={node} />
              </div>
            );
          })
          }
        </Masonry>
      </InfiniteScroll>
    </React.Fragment>
  );
};

ActorsSocialgraph.propTypes = {
  items: ActorsType.isRequired,
  actorNode: ActorType.isRequired,
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  filter: PropTypes.oneOf([
    'followers',
    'leaders',
    'mutual',
    'blocked',
  ]).isRequired,
  queryFilters: PropTypes.object,
  hasMore: PropTypes.bool.isRequired,
};

ActorsSocialgraph.defaultProps = {
  queryFilters: {
    q: '',
  },
};

const mapStateToProps = () => {
  return (state) => {
    const {
      actors: items,
      error,
      hasMore,
    } = state.socialgraph;

    const {
      viewer,
    } = state.session;

    return {
      items,
      error,
      hasMore,
      viewer,
    };
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.socialgraph.browse(params));
    },
    resetList: () => {
      return dispatch(actions.socialgraph.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsSocialgraph);
