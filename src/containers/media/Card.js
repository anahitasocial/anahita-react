import React from 'react';
import PropTypes from 'prop-types';
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
    namespace,
  } = props;

  const ownerName = utils.getOwnerName(medium);
  const canDelete = permissions.canDelete(viewer, medium);
  const MediumDeleteAction = DeleteAction(namespace);

  return (
    <MediumCard
      medium={medium}
      menuItems={[
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
        <NotificationAction
          medium={medium}
          isSubscribed={medium.isSubscribed}
          key={`medium-notification-${medium.id}`}
        />,
        canDelete &&
        <MediumDeleteAction
          medium={medium}
          key={`medium-delete-${medium.id}`}
        />,
      ]}
      actions={
        <React.Fragment>
          <LikeAction
            node={medium}
            isLiked={medium.isVotedUp}
          />
        </React.Fragment>
      }
    />
  );
};

MediaCard.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
  namespace: PropTypes.string.isRequired,
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
