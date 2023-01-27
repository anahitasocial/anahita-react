import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import InfiniteScroll from 'react-infinite-scroll-component';

import actions from '../../../actions';

import ActorType from '../../../proptypes/Actor';
import ActorsType from '../../../proptypes/Actors';
import ActorsCard from './Card';
import Masonry from '../../../components/BreakpointMasonry';
import Progress from '../../../components/Progress';
import { App as APP } from '../../../constants';

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

  const { q } = queryFilters;
  const [start, setStart] = useState(0);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    browseList({
      q,
      filter,
      actor: actorNode,
      start,
      limit: LIMIT,
      ...queryFilters,
    });
  }, [q, filter, start]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  return (
    <>
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
            const follower = items.byId[itemId];
            const key = `socialgraph_node_${follower.id}`;
            return (
              <div
                className={classes.card}
                key={key}
              >
                <ActorsCard leader={actorNode} actor={follower} />
              </div>
            );
          })}
        </Masonry>
      </InfiniteScroll>
    </>
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
    'mutuals',
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
