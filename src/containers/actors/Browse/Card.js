import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DeleteAction from '../../actions/Delete';
import FollowAction from '../../actions/Follow';
import ActorCard from '../../../components/cards/Actor';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';
import i18n from '../../../languages';
import permissions from '../../../permissions/actor';

const { node } = utils;

const ActorsCard = (props) => {
  const {
    actor,
    viewer,
    isAuthenticated,
  } = props;

  const namespace = node.getNamespace(actor);
  const showFollow = isAuthenticated && permissions.canFollow(actor, viewer);
  const showDelete = node.isSuperAdmin(viewer) && viewer.id !== actor.id;

  return (
    <ActorCard
      actor={actor}
      viewer={viewer}
      action={[
        showFollow && <FollowAction
          actor={actor}
          key={`actor-action-follow-${actor.id}`}
        />,
        showDelete && <DeleteAction
          node={actor}
          key={`actor-action-delete-${actor.id}`}
          confirmMessage={i18n.t(`${namespace}:confirm.delete`, {
            name: actor.name,
          })}
        />,
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
