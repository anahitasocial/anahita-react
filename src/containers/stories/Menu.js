import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import utils from '../../utils';
import i18n from '../../languages';

import NotificationAction from '../actions/medium/Notification';
import DeleteAction from '../actions/Delete';
import FollowAction from '../actions/Follow';

import StoryType from '../../proptypes/Story';
import permissions from '../../permissions';

const { withRef } = utils.component;
const {
  getOwnerName,
  isSubscribable,
} = utils.node;

const FollowActionWithRef = withRef(FollowAction);
const NotificationActionWithRef = withRef(NotificationAction);
const DeleteActionWithRef = withRef(DeleteAction);

const StoryMenu = (props) => {
  const { story } = props;

  const [menuAnchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ownerName = getOwnerName(story);
  const { id, owner } = story;
  const canSubscribe = story.object && isSubscribable(story.object);
  const canFollow = permissions.actor.canFollow(owner);
  const canDelete = story.commands && story.commands.includes('delete') && false;

  if (!canSubscribe && !canFollow && !canDelete) {
    return (<></>);
  }

  return (
    <>
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
        {canFollow &&
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
          />}
        {canSubscribe &&
          <NotificationActionWithRef
            medium={story.object}
            isSubscribed={story.object.isSubscribed}
            key={`story-notification-${id}`}
          />}
        {canDelete &&
          <DeleteActionWithRef
            node={story}
            key={`story-delete-${id}`}
          />}
      </Menu>
    </>
  );
};

StoryMenu.propTypes = {
  story: StoryType.isRequired,
};

export default StoryMenu;
