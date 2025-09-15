import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentIcon from '@material-ui/icons/Comment';

import actions from '../../actions';

import LikeAction from '../likes/actions/LikeFeed';
import RepostAction from '../actions/medium/Repost';
import LikesStats from '../likes';
import CommentStats from '../../components/comment/Stats';
import FeedMenu from './Menu';

import Progress from '../../components/Progress';
import FeedItemCard from '../../components/cards/FeedItem';
import NodesType from '../../proptypes/Nodes';
import PersonType from '../../proptypes/Person';
import commentPerms from '../../permissions/comment';
import { App as APP } from '../../constants';
import utils from '../../utils';
import is from '../../constants/is';

const {
  isPerson,
  isMedium,
  isRepost,
  isComment,
} = utils.node;

const { LIMIT } = APP.BROWSE;

const FeedLeadersBrowse = ({
  browseList,
  resetList,
  alertError,
  items,
  hasMore,
  isAuthenticated,
  viewer,
  error,
  isFetching,
}) => {
  const [start, setStart] = useState(0);
  const [openComments, setOpenComments] = useState([]);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    if (!isFetching) {
      browseList({
        include_comments: true,
        include_liked: true,
        include_reposts: true,
        start,
        limit: LIMIT,
      });
    }
  }, [start]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  return (
    <InfiniteScroll
      dataLength={items.allIds.length}
      next={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="feed-progress" />
      }
    >
      {items.allIds.map((itemId) => {
        const node = items.byId[itemId];
        const isMediumNode = isMedium(node);
        const isRepostNode = isRepost(node);
        const isCommentNode = isComment(node);
        const key = `feed_nodes_${node.id}`;
        const canAddComment = commentPerms.canAdd(isMediumNode ? node : node.parent);
        const isCommentsOpen = openComments.includes(node.id);
        const Like = LikeAction('feed_leaders');

        return (
          <FeedItemCard
            node={node}
            key={key}
            menu={isAuthenticated &&
              <FeedMenu
                node={isMediumNode ? node : node.parent}
                viewer={viewer}
              />}
            stats={[
              <LikesStats
                key={`node-like-stat-${node.id}`}
                node={isRepostNode ? node.parent : node}
                comment={isCommentNode && node}
              />,
              !isCommentNode && <CommentStats
                key={`node-comment-stat-${node.id}`}
                node={isMediumNode ? node : node.parent}
                viewer={viewer}
              />,
            ]}
            actions={isAuthenticated && [
              <Like
                node={isRepostNode ? node.parent : node}
                repostNode={isRepostNode ? node : null}
                key={`node-like-${node.id}`}
              />,
              <Button
                onClick={() => {
                  openComments.push(node.id);
                  setOpenComments([...openComments]);
                }}
                disabled={isCommentsOpen || !canAddComment}
                aria-label="Show Comments"
                key={`node-comment-${node.id}`}
                fullWidth
                startIcon={
                  <CommentIcon fontSize="small" />
                }
              >
                Comment
              </Button>,
              <RepostAction
                key={`node-repost-${node.id}`}
                parent={isRepostNode ? node.parent : node}
                repost={isRepostNode ? node : null}
              />,
            ]}
            showOwner={node.owner && !isPerson(node.owner)}
          />
        );
      })}
    </InfiniteScroll>
  );
};

FeedLeadersBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  items: NodesType.isRequired,
  hasMore: PropTypes.bool,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
};

FeedLeadersBrowse.defaultProps = {
  hasMore: true,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    viewer,
  } = state.session;

  const {
    feed_leaders: items,
    hasMore,
    error,
    isFetching,
  } = state.feedLeaders;

  return {
    items,
    hasMore,
    error,
    isFetching,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.feed_leaders.browse(params));
    },
    resetList: () => {
      return dispatch(actions.feed_leaders.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedLeadersBrowse));
