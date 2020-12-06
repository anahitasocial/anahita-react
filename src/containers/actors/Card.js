import React from 'react';

import FollowAction from '../actions/Follow';
import ActorCard from '../../components/cards/Actor';
import permissions from '../../permissions/actor';
import ActorType from '../../proptypes/Actor';

const ActorsCard = (props) => {
  const { actor } = props;
  const canFollow = permissions.canFollow(actor);

  return (
    <ActorCard
      actor={actor}
      action={canFollow &&
        <FollowAction
          actor={actor}
        />
      }
    />
  );
};

ActorsCard.propTypes = {
  actor: ActorType.isRequired,
};

export default ActorsCard;
