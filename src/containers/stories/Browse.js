import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InfiniteScroll from 'react-infinite-scroller';
import CommentIcon from '@material-ui/icons/Comment';

import CommentsBrowse from '../comments/Browse';

import actions from '../../actions/stories';

import LikeAction from '../actions/node/Like';
import NotificationAction from '../actions/medium/Notification';
import DeleteAction from '../actions/story/Delete';
import FollowAction from '../actions/Follow';

import StoryCard from '../../components/cards/Story';
import StoriesType from '../../proptypes/Stories';
import PersonType from '../../proptypes/Person';
import commentPerms from '../../permissions/comment';
import i18n from '../../languages';
import utils from '../utils';

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

const isCommentable = (node) => {
  const commentables = [
    'com.articles.article',
    'com.notes.note',
    'com.photos.photo',
    'com.sets.set',
    'com.topics.topic',
    'com.todos.todo',
  ];

  return commentables.includes(node.objectType);
};

const isSubscribable = (node) => {
  const subscribables = [
    'com.articles.article',
    'com.notes.note',
    'com.photos.photo',
    'com.sets.set',
    'com.topics.topic',
    'com.todos.todo',
  ];

  return subscribables.includes(node.objectType);
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
      openComments: [],
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
      oid: queryFilters.oid,
      filter: queryFilters.filter,
      start: this.offset,
      limit: LIMIT,
    }).then(() => {
      this.offset += LIMIT;
    });
  }

  render() {
    const {
      stories,
      hasMore,
      openComments,
    } = this.state;

    const { viewer, queryFilters } = this.props;

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
              const ownerName = utils.getOwnerName(story);
              const { id, owner } = story;
              const canAddComment = commentPerms.canAdd(story);

              const commentsCount = story.comments.allIds.length;
              const isCommentsOpen = openComments.includes(id);

              return (
                <StoryCard
                  story={story}
                  key={key}
                  menuItems={[
                    owner.id !== viewer.id &&
                    <FollowAction
                      actor={owner}
                      component="menuitem"
                      key={`story-follow-${id}`}
                      followLabel={i18n.t('stories:actions.followOwner', {
                        name: ownerName,
                      })}
                      unfollowLabel={i18n.t('stories:actions.unfollowOwner', {
                        name: ownerName,
                      })}
                    />,
                    story.object && isSubscribable(story.object) &&
                    <NotificationAction
                      medium={story.object}
                      isSubscribed={story.object.isSubscribed}
                      key={`story-notification-${id}`}
                    />,
                    <DeleteAction
                      story={story}
                      key={`story-delete-${id}`}
                    />,
                  ]}
                  actions={[
                    story.object && isLikeable(story.object) &&
                    <LikeAction
                      node={story.object}
                      isLiked={story.commands && story.commands.includes('unvote')}
                      key={`story-like-${story.id}`}
                    />,
                    story.object && isCommentable(story.object) &&
                    <IconButton
                      onClick={() => {
                        openComments.push(id);
                        this.setState({ openComments });
                      }}
                      disabled={isCommentsOpen}
                      aria-label="Show Comments"
                      key={`story-comment-${story.id}`}
                    >
                      <Badge
                        badgeContent={commentsCount}
                        color="primary"
                        invisible={isCommentsOpen || commentsCount === 0}
                      >
                        <CommentIcon fontSize="small" />
                      </Badge>
                    </IconButton>,
                  ]}
                  comments={story.object && isCommentsOpen &&
                    <CommentsBrowse
                      parent={story.object}
                      comments={story.comments}
                      canAdd={canAddComment}
                    />
                  }
                  showOwner={queryFilters.filter === 'leaders'}
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
  viewer: PersonType.isRequired,
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
  } = state.sessions;

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
      return dispatch(actions.browse(params));
    },
    resetStories: () => {
      return dispatch(actions.reset());
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoriesBrowse));
