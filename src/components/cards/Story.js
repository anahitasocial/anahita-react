import React from 'react';
import PropTypes from 'prop-types';

import StoryCardDefault from './story/Default';
import StoryCardComment from './story/Comment';
import StoryCardPhotoAdd from './story/PhotoAdd';

import StoryType from '../../proptypes/Story';

const StoryCard = (props) => {
  const {
    story,
    actions,
    menuItems,
    comments,
    showOwner,
  } = props;

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
          comments={comments}
          showOwner={showOwner}
        />
      );
    case 'photo_add':
      return (
        <StoryCardPhotoAdd
          story={story}
          actions={actions}
          menuItems={menuItems}
          comments={comments}
          showOwner={showOwner}
        />
      );
    default:
      return (
        <StoryCardDefault
          story={story}
          actions={actions}
          menuItems={menuItems}
          comments={comments}
          showOwner={showOwner}
        />
      );
  }
};

StoryCard.propTypes = {
  actions: PropTypes.node,
  menuItems: PropTypes.node,
  comments: PropTypes.node.isRequired,
  story: StoryType.isRequired,
  showOwner: PropTypes.bool,
};

StoryCard.defaultProps = {
  showOwner: false,
  actions: null,
  menuItems: null,
};

export default StoryCard;
