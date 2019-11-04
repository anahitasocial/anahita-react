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

const actionWithRef = (Component) => {
  return React.forwardRef((props, ref) => {
    return <Component {...props} forwardedRef={ref} />;
  });
};

const FollowActionWithRef = actionWithRef(FollowAction);
const NotificationActionWithRef = actionWithRef(NotificationAction);

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
  const showSubscriptionAction = story.object && utils.isSubscribable(story.object);
  const showFollowAction = owner.id !== viewer.id;

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
        {showFollowAction &&
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
        {showSubscriptionAction &&
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
