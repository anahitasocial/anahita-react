import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withWidth from '@material-ui/core/withWidth';

import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';
import containersUtils from '../utils';

import ActorType from '../../proptypes/Actor';
import ActorsType from '../../proptypes/Actors';
import ActorsCard from './Card';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const ActorsSocialgraph = (props) => {
  const {
    browseActors,
    resetActors,
    actors,
    actorNode,
    hasMore,
    width,
    filter,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    const { q } = queryFilters;
    browseActors({
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
      resetActors();
    };
  }, []);

  const columnWidth = containersUtils.getColumnWidthPercentage(width);

  return (
    <React.Fragment>
      <InfiniteScroll
        loadMore={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key="socialgragh-progress" />
        }
      >
        <StackGrid
          columnWidth={columnWidth}
          duration={50}
          gutterWidth={16}
          gutterHeight={16}
        >
          {actors.allIds.map((actorId) => {
            const actor = actors.byId[actorId];
            const key = `socialgraph_${actor.id}`;
            return (
              <ActorsCard
                key={key}
                actor={actor}
              />
            );
          })
          }
        </StackGrid>
      </InfiniteScroll>
    </React.Fragment>
  );
};

ActorsSocialgraph.propTypes = {
  actors: ActorsType.isRequired,
  actorNode: ActorType.isRequired,
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
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
      actors,
      error,
      hasMore,
    } = state.socialgraph;

    const {
      viewer,
    } = state.session;

    return {
      actors,
      error,
      hasMore,
      viewer,
    };
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseActors: (params) => {
      return dispatch(actions.socialgraph.browse(params));
    },
    resetActors: () => {
      return dispatch(actions.socialgraph.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(ActorsSocialgraph));
