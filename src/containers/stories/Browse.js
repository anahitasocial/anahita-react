import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InfiniteScroll from 'react-infinite-scroller';
import CommentIcon from '@material-ui/icons/Comment';

import CommentsBrowse from './comments/Browse';

import actions from '../../actions/stories';

import LikeAction from '../actions/Like';
import StoryMenu from './Menu';

import Progress from '../../components/Progress';
import StoryCard from '../../components/cards/Story';
import PersonType from '../../proptypes/Person';
import commentPerms from '../../permissions/comment';
import utils from '../utils';

const LIMIT = 20;

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

  static getDerivedStateFromProps(props) {
    const { stories, hasMore } = props;
    return { hasMore, stories };
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
      <InfiniteScroll
        loadMore={this.fetchStories}
        hasMore={hasMore}
        loader={
          <Progress key="stories-progress" />
        }
      >
        {stories.allIds.map((storyId) => {
          const story = stories.byId[storyId];
          const key = `story_${story.id}`;
          const canAddComment = commentPerms.canAdd(story);
          const commentsCount = story.comments.allIds.length;
          const isCommentsOpen = openComments.includes(story.id);

          return (
            <StoryCard
              story={story}
              key={key}
              menu={
                <StoryMenu
                  story={story}
                  viewer={viewer}
                />
              }
              actions={[
                story.object && utils.isLikeable(story.object) &&
                <LikeAction
                  node={story.object}
                  liked={story.commands && story.commands.includes('unvote')}
                  key={`story-like-${story.id}`}
                />,
                story.object && utils.isCommentable(story.object) &&
                <IconButton
                  onClick={() => {
                    openComments.push(story.id);
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
    );
  }
}

StoriesBrowse.propTypes = {
  browseStories: PropTypes.func.isRequired,
  resetStories: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
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
  } = state.session;

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
