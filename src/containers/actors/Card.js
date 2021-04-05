import React from 'react';
import { connect } from 'react-redux';

import FollowAction from '../actions/Follow';
import ActorCard from '../../components/cards/Actor';
import permissions from '../../permissions/actor';
import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';

const ActorsCard = (props) => {
  const {
    actor,
    viewer,
  } = props;
  const canFollow = permissions.canFollow(actor);

  return (
    <ActorCard
      actor={actor}
      viewer={viewer}
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
