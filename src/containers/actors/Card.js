import React from 'react';
import PropTypes from 'prop-types';
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
    isAuthenticated,
  } = props;

  const canFollow = permissions.canFollow(isAuthenticated, viewer, actor);

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
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isAuthenticated,
    viewer,
  } = state.session;

  return {
    isAuthenticated,
    viewer,
  };
};

export default connect(mapStateToProps)(ActorsCard);
