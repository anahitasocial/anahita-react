import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import permissions from '../../permissions/medium';
import utils from '../../utils';
import i18n from '../../languages';

import NotificationAction from '../actions/medium/Notification';
import CommentStatusAction from '../actions/medium/CommentStatus';
import DeleteAction from '../actions/Delete';
import FollowAction from '../actions/Follow';

import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';

const { getOwnerName } = utils.node;
const { withRef } = utils.component;

const NotificationActionWithRef = withRef(NotificationAction);
const CommentStatusActionWithRef = withRef(CommentStatusAction);
const FollowActionWithRef = withRef(FollowAction);
const DeleteActionWithRef = withRef(DeleteAction);

const MediaMenu = (props) => {
  const {
    medium,
    viewer,
    handleEdit,
  } = props;

  const ownerName = getOwnerName(medium);
  const canEdit = permissions.canEdit(viewer, medium);
  const canDelete = permissions.canDelete(viewer, medium);


  const [menuAnchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={menuAnchorEl ? `medium-card-menu-${medium.id}` : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`medium-menu-${medium.id}`}
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        {handleEdit &&
          <MenuItem
            onClick={() => {
              handleEdit();
              handleClose();
            }}
            disabled={!canEdit}
          >
            Edit
          </MenuItem>
        }
        <NotificationActionWithRef
          medium={medium}
          isSubscribed={medium.isSubscribed}
          key={`medium-notification-${medium.id}`}
        />
        <CommentStatusActionWithRef
          medium={medium}
          key={`medium-comment-status-${medium.id}`}
        />
        {medium.owner.id !== viewer.id &&
          <FollowActionWithRef
            actor={medium.owner}
            component="menuitem"
            key={`medium-follow-${medium.id}`}
            followLabel={i18n.t('stories:actions.followOwner', {
              name: ownerName,
            })}
            unfollowLabel={i18n.t('stories:actions.unfollowOwner', {
              name: ownerName,
            })}
          />
        }
        {canDelete &&
          <DeleteActionWithRef
            node={medium}
            key={`medium-delete-${medium.id}`}
          />
        }
      </Menu>
    </React.Fragment>
  );
};

MediaMenu.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
  handleEdit: PropTypes.func,
};

MediaMenu.defaultProps = {
  handleEdit: null,
};

export default MediaMenu;
