import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InfiniteScroll from 'react-infinite-scroller';
import CommentIcon from '@material-ui/icons/Comment';

import CommentsBrowse from './comments/Browse';

import actions from '../../actions/stories';

import LikeAction from '../likes/actions/Like';
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
    browseList,
    resetList,
    queryFilters = {
      oid: 0,
      filter: '',
    },
    items,
    hasMore,
    viewer,
  } = props;

  const [openComments, setOpenComments] = useState([]);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);

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
        const commentsCount = node.comments.allIds.length;
        const isCommentsOpen = openComments.includes(node.id);

        let Like = null;

        if (node.object && utils.isLikeable(node.object)) {
          Like = LikeAction(node.object.objectType.split('.')[1]);
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
            actions={[
              node.object && utils.isLikeable(node.object) &&
              <Like
                node={node.object}
                key={`story-like-${node.object.id}`}
              />,
              node.object && utils.isCommentable(node.object) &&
              <IconButton
                onClick={() => {
                  openComments.push(node.id);
                  setOpenComments([...openComments]);
                }}
                disabled={isCommentsOpen}
                aria-label="Show Comments"
                key={`story-comment-${node.id}`}
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
            comments={node.object && isCommentsOpen &&
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
  queryFilters: PropTypes.objectOf(PropTypes.any).isRequired,
  viewer: PersonType.isRequired,
  items: StoriesType.isRequired,
  hasMore: PropTypes.bool.isRequired,
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

  return {
    items,
    hasMore,
    error,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.browse(params));
    },
    resetList: () => {
      return dispatch(actions.reset());
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoriesBrowse));
