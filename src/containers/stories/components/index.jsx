import React from 'react';
import PropTypes from 'prop-types';

import StoryCardDefault from './Default';
import StoryCardActor from './Actor';
import StoryCardComment from './Comment';
import StoryCardPhotoAdd from './PhotoAdd';
import StoryCardTodoStatus from './TodoStatus';

import StoryType from '../../../proptypes/Story';

const StoryCard = ({
  story,
  stats = null,
  actions = null,
  menu = null,
  comments = null,
  showOwner = false,
}) => {
  switch (story.name) {
    case 'actor_follow':
    case 'actor_follower_add':
      return (
        <StoryCardActor
          story={story}
          stats={stats}
          actions={actions}
          menu={menu}
          comments={comments}
          showOwner={showOwner}
        />
      );
    case 'article_comment':
    case 'photo_comment':
    case 'note_comment':
    case 'set_comment':
    case 'todo_comment':
    case 'topic_comment':
      return (
        <StoryCardComment
          story={story}
          stats={stats}
          actions={actions}
          menu={menu}
          comments={comments}
          showOwner={showOwner}
        />
      );
    case 'photo_add':
      return (
        <StoryCardPhotoAdd
          story={story}
          stats={stats}
          actions={actions}
          menu={menu}
          comments={comments}
          showOwner={showOwner}
        />
      );
    case 'todo_enable':
    case 'todo_disable':
      return (
        <StoryCardTodoStatus
          story={story}
          stats={stats}
          actions={actions}
          menu={menu}
          comments={comments}
          showOwner={showOwner}
        />
      );
    default:
      return (
        <StoryCardDefault
          story={story}
          stats={stats}
          actions={actions}
          menu={menu}
          comments={comments}
          showOwner={showOwner}
        />
      );
  }
};

StoryCard.propTypes = {
  actions: PropTypes.node,
  stats: PropTypes.node,
  menu: PropTypes.node,
  comments: PropTypes.node,
  story: StoryType.isRequired,
  showOwner: PropTypes.bool,
};

export default StoryCard;
