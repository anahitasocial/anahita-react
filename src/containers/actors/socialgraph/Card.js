import React from 'react';
import { connect } from 'react-redux';

import FollowAction from '../../actions/Follow';
import BlockAction from '../../actions/Block';
import RemoveFollowerAction from '../../actions/RemoveFollower';

import ActorCard from '../../../components/cards/Actor';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';

const { node } = utils;

const ActorsCard = (props) => {
  const {
    actor,
    leader,
    viewer,
  } = props;

  const leaderNamespace = node.getNamespace(leader);

  const canFollow = leaderNamespace === 'people' && permissions.canFollow(actor);
  const canBlock = leaderNamespace === 'people' && permissions.canBlock(actor);
  const canAdminister = leaderNamespace !== 'people' && permissions.canAdminister(actor) && viewer.id !== actor.id;

  return (
    <ActorCard
      actor={actor}
      viewer={viewer}
      action={[
        canFollow && <FollowAction
          actor={actor}
          key={`actor-action-follow-${actor.id}`}
        />,
        canBlock && <BlockAction
          actor={actor}
          key={`actor-action-block-${actor.id}`}
        />,
        canAdminister && <RemoveFollowerAction
          actor={leader}
          follower={actor}
          key={`actor-action-remove-follower-${actor.id}`}
        />,
      ]}
    />
  );
};

ActorsCard.propTypes = {
  actor: PersonType.isRequired,
  leader: ActorType.isRequired,
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

export default connect(mapStateToProps)(ActorsCard);
