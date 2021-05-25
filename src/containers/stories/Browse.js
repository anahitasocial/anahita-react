import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroller';
import CommentIcon from '@material-ui/icons/Comment';

import CommentsBrowse from './comments/Browse';
import actions from '../../actions';

import LikeAction from '../likes/actions/LikeStory';
import LikesStats from '../likes';
import CommentStats from '../../components/comment/Stats';
import StoryMenu from './Menu';

import Progress from '../../components/Progress';
import StoryCard from '../../components/cards/Story';
import NodesType from '../../proptypes/Nodes';
import PersonType from '../../proptypes/Person';
import StoriesType from '../../proptypes/Stories';
import commentPerms from '../../permissions/comment';
import utils from '../../utils';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const {
  isLikeable,
  isCommentable,
} = utils.node;

const StoriesBrowse = (props) => {
  const {
    browseList,
    resetList,
    alertError,
    queryFilters = {
      oid: 0,
      filter: '',
    },
    items,
    comments,
    hasMore,
    viewer,
    error,
  } = props;

  const [openComments, setOpenComments] = useState([]);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    const { oid, filter } = queryFilters;

    browseList({
      oid,
      filter,
      start,
      limit: LIMIT,
    });
  };

  const getNumOfComments = (node) => {
    if (node.object && isCommentable(node.object)) {
      if (comments.byId[node.object.id]) {
        return comments.byId[node.object.id].allIds.length;
      }

      return node.comments.allIds.length;
    }

    return 0;
  };

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="stories-progress" />
      }
    >
      {items.allIds.map((itemId) => {
        const node = items.byId[itemId];
        const key = `stories_node_${node.id}`;
        const canAddComment = commentPerms.canAdd(node);
        const numOfComments = getNumOfComments(node);
        const isCommentsOpen = openComments.includes(node.id);

        let Like = null;

        if (node.object && isLikeable(node.object)) {
          Like = LikeAction('stories');
        }

        return (
          <StoryCard
            story={node}
            key={key}
            menu={
              <StoryMenu
                story={node}
                viewer={viewer}
              />
            }
            stats={[
              node.object && isLikeable(node.object) &&
              <LikesStats
                key={`story-like-stat-${node.object.id}`}
                node={node.object}
              />,
              node.object && isCommentable(node.object) &&
              <CommentStats
                key={`story-comment-stat-${node.object.id}`}
                node={{
                  ...node.object,
                  numOfComments,
                }}
              />,
            ]}
            actions={[
              node.object && isLikeable(node.object) &&
              <Like
                story={node}
                node={node.object}
                key={`story-like-${node.object.id}`}
              />,
              node.object && isCommentable(node.object) &&
              <Button
                onClick={() => {
                  openComments.push(node.id);
                  setOpenComments([...openComments]);
                }}
                disabled={isCommentsOpen}
                aria-label="Show Comments"
                key={`story-comment-${node.id}`}
                fullWidth
                startIcon={
                  <CommentIcon fontSize="small" />
                }
              >
                Comment
              </Button>,
            ]}
            comments={node.object && isCommentable(node.object) && isCommentsOpen &&
              <CommentsBrowse
                parent={node.object}
                comments={node.comments}
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
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  queryFilters: PropTypes.objectOf(PropTypes.any).isRequired,
  viewer: PersonType.isRequired,
  items: StoriesType.isRequired,
  comments: NodesType.isRequired,
  hasMore: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    viewer,
  } = state.session;

  const {
    stories: items,
    hasMore,
    error,
  } = state.stories;

  const {
    parents: comments,
  } = state.commentsInline;

  return {
    items,
    comments,
    hasMore,
    error,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.stories.browse(params));
    },
    resetList: () => {
      return dispatch(actions.stories.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoriesBrowse));
