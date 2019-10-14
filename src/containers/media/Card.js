import React from 'react';
import { connect } from 'react-redux';

import permissions from '../../permissions/medium';
import utils from '../utils';
import i18n from '../../languages';
import MediumCard from '../../components/cards/Medium';

import LikeAction from '../actions/node/Like';
import NotificationAction from '../actions/medium/Notification';
import DeleteAction from '../actions/medium/Delete';
import FollowAction from '../actions/Follow';

import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';


const MediaCard = (props) => {
  const {
    medium,
    viewer,
  } = props;

  const ownerName = utils.getOwnerName(medium);
  const canDelete = permissions.canDelete(viewer, medium);

  return (
    <MediumCard
      medium={medium}
      menuItems={[
        <NotificationAction
          medium={medium}
          isSubscribed={medium.isSubscribed}
          key={`medium-notification-${medium.id}`}
        />,
        medium.owner.id !== viewer.id &&
        <FollowAction
          actor={medium.owner}
          component="menuitem"
          key={`medium-follow-${medium.id}`}
          followLabel={i18n.t('stories:actions.followOwner', {
            name: ownerName,
          })}
          unfollowLabel={i18n.t('stories:actions.unfollowOwner', {
            name: ownerName,
          })}
        />,
        canDelete &&
        <DeleteAction
          medium={medium}
          key={`medium-delete-${medium.id}`}
        />,
      ]}
      actions={
        <LikeAction
          node={medium}
          isLiked={medium.isVotedUp}
        />
      }
    />
  );
};

MediaCard.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.session;

  return {
    viewer,
  };
};

export default connect(mapStateToProps)(MediaCard);
