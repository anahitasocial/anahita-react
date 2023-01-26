import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions/socialgraph';
import permissions from '../../permissions/actor';
import ActorsType from '../../proptypes/Actors';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const FollowAction = React.forwardRef((props, ref) => {
  const {
    followActor,
    unfollowActor,
    actor,
    actors,
    viewer,
    component,
    followLabel,
    unfollowLabel,
  } = props;

  const isLeader = actors.byId[actor.id] ? actors.byId[actor.id].isLeader : actor.isLeader;
  const canFollow = permissions.canFollow(actor);

  const [leader, setLeader] = useState(isLeader);
  const [waiting, setWaiting] = useState(false);

  const handleFollow = () => {
    setWaiting(true);
    followActor(viewer, actor)
      .then(() => {
        setWaiting(false);
        setLeader(true);
      });
  };

  const handleUnfollow = () => {
    setWaiting(true);
    unfollowActor(viewer, actor)
      .then(() => {
        setWaiting(false);
        setLeader(false);
      });
  };

  const title = leader ? unfollowLabel : followLabel;
  const onClick = leader ? handleUnfollow : handleFollow;
  const color = leader ? 'inherit' : 'primary';

  if (component === 'menuitem') {
    return (
      <MenuItem
        onClick={onClick}
        disabled={!canFollow || waiting}
        ref={ref}
      >
        {title}
      </MenuItem>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={!canFollow || waiting}
      color={color}
      ref={ref}
    >
      {title}
    </Button>
  );
});

FollowAction.propTypes = {
  followActor: PropTypes.func.isRequired,
  unfollowActor: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  actors: ActorsType.isRequired,
  viewer: PersonType.isRequired,
  component: PropTypes.oneOf(['button', 'menuitem']),
  followLabel: PropTypes.string,
  unfollowLabel: PropTypes.string,
};

FollowAction.defaultProps = {
  component: 'button',
  followLabel: i18n.t('actions:follow'),
  unfollowLabel: i18n.t('actions:unfollow'),
};

const mapStateToProps = (state) => {
  const {
    viewer,
    isAuthenticated,
  } = state.session;

  const {
    actors,
  } = state.socialgraph;

  return {
    actors,
    viewer,
    isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    followActor: (viewer, actor) => {
      return dispatch(actions.follow(viewer, actor));
    },
    unfollowActor: (viewer, actor) => {
      return dispatch(actions.unfollow(viewer, actor));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowAction);
