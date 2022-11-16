import React from 'react';
import { connect } from 'react-redux';

import DeleteAction from '../../actions/Delete';
import FollowAction from '../../actions/Follow';
import ActorCard from '../../../components/cards/Actor';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import utils from '../../../utils';
import i18n from '../../../languages';

const { node } = utils;

const ActorsCard = (props) => {
  const {
    actor,
    viewer,
  } = props;

  const canFollow = permissions.canFollow(actor);
  // const canAdminister = permissions.canAdminister(viewer) && viewer.id !== actor.id;
  const isSuperAdmin = node.isSuperAdmin(viewer) && viewer.id !== actor.id;
  const namespace = node.getNamespace(actor);

  return (
    <ActorCard
      actor={actor}
      viewer={viewer}
      action={[
        canFollow && <FollowAction
          actor={actor}
          key={`actor-action-follow-${actor.id}`}
        />,
        isSuperAdmin && <DeleteAction
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
