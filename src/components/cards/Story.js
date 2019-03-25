import React from 'react';
import PropTypes from 'prop-types';

import StoryCardDefault from './story/Default';
import StoryCardComment from './story/Comment';
import StoryCardPhotoAdd from './story/PhotoAdd';

const StoryCard = (props) => {
  const { story, actions, menuItems } = props;

  switch (story.name) {
    case 'article_comment':
    case 'photo_comment':
    case 'note_comment':
    case 'set_comment':
    case 'todo_comment':
    case 'topic_comment':
      return (
        <StoryCardComment
          story={story}
          actions={actions}
          menuItems={menuItems}
        />
      );
    case 'photo_add':
      return (
        <StoryCardPhotoAdd
          story={story}
          actions={actions}
          menuItems={menuItems}
        />
      );
    default:
      return (
        <StoryCardDefault
          story={story}
          actions={actions}
          menuItems={menuItems}
        />
      );
  }
};

StoryCard.propTypes = {
  actions: PropTypes.node.isRequired,
  menuItems: PropTypes.node.isRequired,
  story: PropTypes.object.isRequired,
};

export default StoryCard;
