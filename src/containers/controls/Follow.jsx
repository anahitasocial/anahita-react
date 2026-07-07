import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions/socialgraph';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const ControlsFollow = React.forwardRef((props, ref) => {
  const {
    followActor,
    unfollowActor,
    actor,
    component = 'button',
    followLabel = i18n.t('actions:follow'),
    unfollowLabel = i18n.t('actions:unfollow'),
    viewer,
  } = props;

  const [leader, setLeader] = useState(actor.isLeadingViewer);
  const [waiting, setWaiting] = useState(false);

  const handleFollow = () => {
    setWaiting(true);
    followActor({ actor, viewer })
      .then(() => {
        setWaiting(false);
        setLeader(true);
      });
  };

  const handleUnfollow = () => {
    setWaiting(true);
    unfollowActor({ actor, viewer })
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
        disabled={waiting}
        ref={ref}
      >
        {title}
      </MenuItem>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={waiting}
      color={color}
      ref={ref}
    >
      {title}
    </Button>
  );
});

ControlsFollow.propTypes = {
  followActor: PropTypes.func.isRequired,
  unfollowActor: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  component: PropTypes.oneOf(['button', 'menuitem']),
  followLabel: PropTypes.string,
  unfollowLabel: PropTypes.string,
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

const mapDispatchToProps = (dispatch) => {
  return {
    followActor: (params) => {
      return dispatch(actions.follow(params));
    },
    unfollowActor: (params) => {
      return dispatch(actions.unfollow(params));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlsFollow);
