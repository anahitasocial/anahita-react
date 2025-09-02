import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import utils from '../../utils';
import i18n from '../../languages';

import NotificationSubAction from '../actions/medium/NotificationSub';
import DeleteAction from '../actions/Delete';
import FollowAction from '../actions/Follow';

import PersonType from '../../proptypes/Person';
import NodeType from '../../proptypes/Node';
import permissions from '../../permissions';

const { withRef } = utils.component;
const {
  getOwnerName,
  isSubscribable,
} = utils.node;

const FollowActionWithRef = withRef(FollowAction);
const NotificationSubActionWithRef = withRef(NotificationSubAction);
const DeleteActionWithRef = withRef(DeleteAction);

const FeedItemMenu = ({
  node,
  viewer,
}) => {
  const [menuAnchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ownerName = getOwnerName(node);
  const { id } = node;
  const canSubscribe = node.id && isSubscribable(node);
  const canFollow = permissions.actor.canFollow(node.owner, viewer);
  const canDelete = node.commands && node.commands.includes('delete');

  if (!canSubscribe && !canFollow && !canDelete) {
    return (<></>);
  }

  return (
    <>
      <IconButton
        aria-owns={menuAnchorEl ? `node-card-menu-${id}` : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`node-menu-${id}`}
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        {canFollow &&
          <FollowActionWithRef
            actor={node.owner}
            component="menuitem"
            key={`feed-follow-${id}`}
            followLabel={i18n.t('feed:actions.followOwner', {
              name: ownerName,
            })}
            unfollowLabel={i18n.t('feed:actions.unfollowOwner', {
              name: ownerName,
            })}
          />}
        {canSubscribe &&
          <NotificationSubActionWithRef
            medium={node}
            isSubscribedByViewer={node.isSubscribedByViewer}
            key={`feed-notification-${id}`}
          />}
        {canDelete &&
          <DeleteActionWithRef
            node={node}
            key={`feed-delete-${id}`}
          />}
      </Menu>
    </>
  );
};

FeedItemMenu.propTypes = {
  node: NodeType.isRequired,
  viewer: PersonType.isRequired,
};

export default FeedItemMenu;
