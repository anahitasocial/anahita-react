import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ControlFollow from '../../controls/Follow';
import ActorCard from '../../../components/ActorCard';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import permissions from '../../../permissions/actor';

const ActorsCard = (props) => {
  const {
    actor,
    viewer,
    isAuthenticated,
  } = props;

  const showFollow = isAuthenticated && permissions.canFollow(actor, viewer);

  return (
    <ActorCard
      actor={actor}
      viewer={viewer}
      action={[
        showFollow && <ControlFollow
          actor={actor}
          key={`actor-action-follow-${actor.id}`}
        />,
        // No delete on a browse card. One click and one generic dialog, on a
        // list where the cards look alike — the easiest place in the app to
        // destroy the wrong profile, and it bypassed every disclosure in the
        // Danger zone. Admins delete from settings, where the tier decides
        // how much ceremony the account warrants.
      ]}
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
    viewer,
    isAuthenticated,
  } = state.session;

  return {
    viewer,
    isAuthenticated,
  };
};

export default connect(mapStateToProps)(ActorsCard);
