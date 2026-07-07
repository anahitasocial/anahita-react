import React from 'react';
import { connect } from 'react-redux';

import ControlFollow from '../../controls/Follow';
import ControlBlock from '../../controls/Block';
import ControlRemoveFollower from '../../controls/RemoveFollower';

import ActorCard from '../../../components/ActorCard';
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

  const canFollow = leaderNamespace === 'people' && permissions.canFollow(actor, viewer);
  const canBlock = leaderNamespace === 'people' && permissions.canBlock(actor, viewer);
  const canAdminister = leaderNamespace !== 'people' && permissions.canAdminister(actor) && viewer.id !== actor.id;

  return (
    <ActorCard
      actor={actor}
      viewer={viewer}
      action={[
        canFollow && <ControlFollow
          actor={actor}
          key={`actor-action-follow-${actor.id}`}
        />,
        canBlock && <ControlBlock
          actor={actor}
          key={`actor-action-block-${actor.id}`}
        />,
        canAdminister && <ControlRemoveFollower
          actor={leader}
          follower={actor}
          key={`actor-action-remove-follower-${actor.id}`}
        />,
      ]}
    />
  );
};

ActorsCard.propTypes = {
  actor: ActorType.isRequired,
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
