import React, { useEffect, useState } from 'react';
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
import StoriesType from '../../proptypes/Stories';
import commentPerms from '../../permissions/comment';
import utils from '../utils';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const StoriesBrowse = (props) => {
  const {
    browseStories,
    resetStories,
    queryFilters,
    stories,
    hasMore,
    viewer,
  } = props;

  const [openComments, setOpenComments] = useState([]);

  useEffect(() => {
    return () => {
      resetStories();
    };
  }, []);

  const fetchList = (page) => {
    browseStories({
      oid: queryFilters.oid,
      filter: queryFilters.filter,
      start: page * LIMIT,
      limit: LIMIT,
    });
  };

  return (
    <InfiniteScroll
      loadMore={fetchList}
      hasMore={hasMore}
      pageStart={-1}
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
                  setOpenComments(openComments);
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
};

StoriesBrowse.propTypes = {
  browseStories: PropTypes.func.isRequired,
  resetStories: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  viewer: PersonType.isRequired,
  stories: StoriesType.isRequired,
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
