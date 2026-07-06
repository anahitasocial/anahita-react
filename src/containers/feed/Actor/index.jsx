import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentIcon from '@material-ui/icons/Comment';

import actions from '../../../actions';

import ControlLike from '../../likes/controls/LikeFeed';
import ControlRepost from '../../controls/Repost';
import LikesStats from '../../likes';
import CommentStats from '../../../components/comment/Stats';
import FeedMenu from '../Menu';

import Progress from '../../../components/Progress';
import FeedCardDefault from '../../../components/cards/feed/Default';
import FeedCardComment from '../../../components/cards/feed/Comment';
import FeedCardRepost from '../../../components/cards/feed/Repost';
import ActorType from '../../../proptypes/Actor';
import ActorDefault from '../../../proptypes/ActorDefault';
import NodesType from '../../../proptypes/Nodes';
import PersonType from '../../../proptypes/Person';
import commentPerms from '../../../permissions/comment';
import { App as APP } from '../../../constants';
import utils from '../../../utils';

const {
  isMedium,
  isRepost,
  isComment,
} = utils.node;

const { LIMIT } = APP.BROWSE;

const FeedActorBrowse = ({
  actor = { ...ActorDefault },
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
        id: actor.id,
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
        const Like = ControlLike('feed_actor');

        if (isCommentNode) {
          return (
            <FeedCardComment
              node={{
                ...node,
                owner: actor,
              }}
              key={key}
              menu={isAuthenticated &&
                <FeedMenu
                  node={{
                    ...node.parent,
                    owner: actor,
                  }}
                  viewer={viewer}
                />}
              stats={[
                <LikesStats
                  key={`node-like-stat-${node.id}`}
                  node={node.parent}
                  comment={node}
                />,
                <CommentStats
                  key={`node-comment-stat-${node.id}`}
                  node={node.parent}
                  viewer={viewer}
                />,
              ]}
              actions={isAuthenticated && [
                <Like
                  node={node.parent}
                  comment={node}
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
                  {node.parent.numOfComments > 0 && node.parent.numOfComments}
                </Button>,
              ]}
            />
          );
        }

        if (isRepostNode) {
          return (
            <FeedCardRepost
              node={{
                ...node,
                owner: actor,
              }}
              key={key}
              menu={isAuthenticated &&
                <FeedMenu
                  node={{
                    ...node.parent,
                    owner: actor,
                  }}
                  viewer={viewer}
                />}
              stats={[
                <LikesStats
                  key={`node-like-stat-${node.parent.id}`}
                  node={node.parent}
                  comment={null}
                />,
                <CommentStats
                  key={`node-comment-stat-${node.parent.id}`}
                  node={node.parent}
                  viewer={viewer}
                />,
              ]}
              actions={isAuthenticated && [
                <Like
                  node={node.parent}
                  repostNode={node}
                  key={`node-like-${node.id}`}
                />,
                <Button
                  onClick={() => {
                    if (!isCommentsOpen && canAddComment) {
                      openComments.push(node.id);
                      setOpenComments([...openComments]);
                    }
                  }}
                  disabled={isCommentsOpen || !canAddComment}
                  aria-label="Show Comments"
                  key={`node-comment-${node.id}`}
                  fullWidth
                  startIcon={
                    <CommentIcon fontSize="small" />
                  }
                >
                  {node.parent.numOfComments > 0 && node.parent.numOfComments}
                </Button>,
                <ControlRepost
                  key={`node-repost-${node.id}`}
                  parent={node.parent}
                />,
              ]}
            />
          );
        }

        return (
          <FeedCardDefault
            node={{
              ...node,
              owner: actor,
            }}
            key={key}
            menu={isAuthenticated &&
              <FeedMenu
                node={{
                  ...node,
                  owner: actor,
                }}
                viewer={viewer}
              />}
            stats={[
              <LikesStats
                key={`node-like-stat-${node.id}`}
                node={node}
                comment={null}
              />,
              <CommentStats
                key={`node-comment-stat-${node.id}`}
                node={node}
                viewer={viewer}
              />,
            ]}
            actions={isAuthenticated && [
              <Like
                node={node}
                repostNode={null}
                key={`node-like-${node.id}`}
              />,
              <Button
                onClick={() => {
                  if (!isCommentsOpen && canAddComment) {
                    openComments.push(node.id);
                    setOpenComments([...openComments]);
                  }
                }}
                disabled={isCommentsOpen || !canAddComment}
                aria-label="Show Comments"
                key={`node-comment-${node.id}`}
                fullWidth
                startIcon={
                  <CommentIcon fontSize="small" />
                }
              >
                {node.numOfComments > 0 && node.numOfComments}
              </Button>,
              <ControlRepost
                key={`node-repost-${node.id}`}
                parent={node}
              />,
            ]}
          />
        );
      })}
    </InfiniteScroll>
  );
};

FeedActorBrowse.propTypes = {
  actor: ActorType,
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

FeedActorBrowse.defaultProps = {
  actor: ActorDefault,
  hasMore: true,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    viewer,
  } = state.session;

  const {
    feed_actor: items,
    hasMore,
    error,
    isFetching,
  } = state.feedActor;

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
      return dispatch(actions.feed_actor.browse(params));
    },
    resetList: () => {
      return dispatch(actions.feed_actor.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedActorBrowse));
