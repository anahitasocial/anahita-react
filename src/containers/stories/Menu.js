import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import utils from '../utils';
import i18n from '../../languages';

import NotificationAction from '../actions/medium/Notification';
import DeleteAction from '../actions/Delete';
import FollowAction from '../actions/Follow';

import PersonType from '../../proptypes/Person';
import StoryType from '../../proptypes/Story';

const FollowActionWithRef = React.forwardRef((props, ref) => {
  return <FollowAction {...props} forwardedRef={ref} />;
});

const NotificationActionWithRef = React.forwardRef((props, ref) => {
  return <NotificationAction {...props} forwardedRef={ref} />;
});

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

const StoryMenu = (props) => {
  const {
    story,
    viewer,
  } = props;

  const [menuAnchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ownerName = utils.getOwnerName(story);
  const { id, owner } = story;

  return (
    <React.Fragment>
      <IconButton
        aria-owns={menuAnchorEl ? `story-card-menu-${id}` : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`story-menu-${id}`}
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        {owner.id !== viewer.id &&
          <FollowActionWithRef
            actor={owner}
            component="menuitem"
            key={`story-follow-${id}`}
            followLabel={i18n.t('stories:actions.followOwner', {
              name: ownerName,
            })}
            unfollowLabel={i18n.t('stories:actions.unfollowOwner', {
              name: ownerName,
            })}
          />
        }
        {story.object && isSubscribable(story.object) &&
          <NotificationActionWithRef
            medium={story.object}
            isSubscribed={story.object.isSubscribed}
            key={`story-notification-${id}`}
          />
        }
        <DeleteAction
          node={story}
          key={`story-delete-${id}`}
        />
      </Menu>
    </React.Fragment>
  );
};

StoryMenu.propTypes = {
  story: StoryType.isRequired,
  viewer: PersonType.isRequired,
};

export default StoryMenu;
