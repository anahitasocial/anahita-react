import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withWidth from '@material-ui/core/withWidth';

import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';
import containersUtils from '../utils';

import ActorType from '../../proptypes/Actor';
import ActorsCard from './Card';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

class ActorsSocialgraph extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      keywordFilter: '',
      hasMore: true,
      actors: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
    this.fetchActors = this.fetchActors.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { actors, hasMore } = nextProps;
    return { actors, hasMore };
  }

  componentWillUnmount() {
    const { resetActors } = this.props;
    resetActors();
  }

  fetchActors() {
    const { keywordFilter } = this.state;
    const { actor, browseActors, filter } = this.props;

    browseActors({
      q: keywordFilter,
      filter,
      actor,
      start: this.offset,
      limit: LIMIT,
    }).then(() => {
      this.offset += LIMIT;
    });
  }

  render() {
    const { width } = this.props;
    const { actors, hasMore } = this.state;
    const columnWidth = containersUtils.getColumnWidthPercentage(width);

    return (
      <React.Fragment>
        <InfiniteScroll
          loadMore={this.fetchActors}
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
  }
}

ActorsSocialgraph.propTypes = {
  actor: ActorType.isRequired,
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
  filter: PropTypes.oneOf([
    'followers',
    'leaders',
    'mutual',
    'blocked',
  ]).isRequired,
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
