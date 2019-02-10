import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import actions from '../../actions/stories';

import StoryCard from '../../components/cards/Story';

const LIMIT = 20;

class StoriesContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      queryFilters: props.queryFilters,
      hasMore: true,
    };

    this.offset = 0;
    this.fetchStories = this.fetchStories.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { stories } = nextProps;
    this.setState({
      hasMore: stories.allIds.length >= LIMIT,
    });
  }

  componentWillUnmount() {
    const { resetStories } = this.props;
    resetStories();
  }

  fetchStories() {
    const { queryFilters } = this.state;
    const { browseStories } = this.props;

    browseStories({
      ownerId: queryFilters.oid,
      filter: queryFilters.filter,
      start: this.offset,
      limit: LIMIT,
    });

    this.offset += LIMIT;
  }

  render() {
    const {
      stories,
    } = this.props;

    return (
      <Grid
        container
        justify="center"
      >
        <Grid item xs={12} md={4}>
          <InfiniteScroll
            loadMore={this.fetchStories}
            hasMore={this.state.hasMore}
            loader={
              <Grid
                container
                justify="center"
                alignItems="center"
                key="stories-progress"
              >
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            }
          >
            {stories.allIds.map((storyId) => {
              const story = stories.byId[storyId];
              const key = `story_${story.id}`;
              return (
                <StoryCard
                  story={story}
                  key={key}
                />
              );
            })
            }
          </InfiniteScroll>
        </Grid>
      </Grid>
    );
  }
}

StoriesContainer.propTypes = {
  browseStories: PropTypes.func.isRequired,
  resetStories: PropTypes.func.isRequired,
  stories: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
  queryFilters: PropTypes.object,
};

StoriesContainer.defaultProps = {
  queryFilters: {
    filter: '',
    oid: '',
  },
};

const mapStateToProps = (state) => {
  const {
    stories,
    error,
  } = state.stories;

  return {
    stories,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseStories: (params) => {
      dispatch(actions.browse(params));
    },
    resetStories: () => {
      dispatch(actions.reset());
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoriesContainer));
