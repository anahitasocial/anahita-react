import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import actions from '../../actions/stories';

import LikeAction from '../actions/Like';
import DeleteAction from '../actions/story/Delete';

import StoryCard from '../../components/cards/Story';
import StoriesType from '../../proptypes/Stories';

const LIMIT = 20;

const isLikeable = (node) => {
  const likeables = [
    'com.articles.article',
    'com.notes.note',
    'com.photos.photo',
    'com.sets.set',
    'com.topics.topic',
    'com.todos.todo',
  ];

  return likeables.includes(node.objectType);
};

class StoriesBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hasMore: true,
      stories: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
    this.fetchStories = this.fetchStories.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { stories, hasMore } = nextProps;
    this.setState({ hasMore, stories });
  }

  componentWillUnmount() {
    const { resetStories } = this.props;
    resetStories();
  }

  fetchStories() {
    const {
      browseStories,
      queryFilters,
    } = this.props;

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
      hasMore,
    } = this.state;

    return (
      <Grid
        container
        justify="center"
      >
        <Grid item xs={12} md={4}>
          <InfiniteScroll
            loadMore={this.fetchStories}
            hasMore={hasMore}
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
                  menuItems={[
                    <DeleteAction
                      story={story}
                      key={`story-delete-${story.id}`}
                    />,
                  ]}
                  actions={[
                    story.object && isLikeable(story.object) &&
                    <LikeAction
                      medium={story.object}
                      isLiked={story.commands.includes('unvote')}
                      key={`story-like-${story.id}`}
                    />,
                  ]}
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

StoriesBrowse.propTypes = {
  browseStories: PropTypes.func.isRequired,
  resetStories: PropTypes.func.isRequired,
  stories: StoriesType.isRequired,
  queryFilters: PropTypes.object,
  hasMore: PropTypes.bool.isRequired,
};

StoriesBrowse.defaultProps = {
  queryFilters: {
    filter: '',
    oid: '',
  },
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    viewer,
  } = state.auth;

  const {
    stories,
    hasMore,
    error,
  } = state.stories;

  return {
    stories,
    hasMore,
    error,
    isAuthenticated,
    viewer,
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
)(StoriesBrowse));
