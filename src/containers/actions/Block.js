import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions/socialgraph';
import ActorsType from '../../proptypes/Actors';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const BlockAction = React.forwardRef((props, ref) => {
  const {
    blockPerson,
    unblockPerson,
    actor,
    actors,
    component,
    blockLabel,
    unblockLabel,
    viewer,
  } = props;

  const isBlocked = actors.byId[actor.id] ? actors.byId[actor.id].isBlocked : actor.isBlocked;
  const [blocked, setBlocked] = useState(isBlocked);
  const [waiting, setWaiting] = useState(false);

  const handleBlock = () => {
    setWaiting(true);
    blockPerson({ actor, viewer })
      .then(() => {
        setWaiting(false);
        setBlocked(true);
      });
  };

  const handleUnblock = () => {
    setWaiting(true);
    unblockPerson({ actor, viewer })
      .then(() => {
        setWaiting(false);
        setBlocked(false);
      });
  };

  const title = blocked ? unblockLabel : blockLabel;
  const onClick = blocked ? handleUnblock : handleBlock;
  const color = blocked ? 'secondary' : 'inherit';

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

BlockAction.propTypes = {
  blockPerson: PropTypes.func.isRequired,
  unblockPerson: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  actors: ActorsType.isRequired,
  component: PropTypes.oneOf(['button', 'menuitem']),
  blockLabel: PropTypes.string,
  unblockLabel: PropTypes.string,
  viewer: PersonType.isRequired,
};

BlockAction.defaultProps = {
  component: 'button',
  blockLabel: i18n.t('actions:block'),
  unblockLabel: i18n.t('actions:unblock'),
};

const mapStateToProps = (state) => {
  const {
    actors,
  } = state.socialgraph;

  const {
    viewer,
  } = state.session;

  return {
    actors,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    blockPerson: (param) => {
      return dispatch(actions.block(param));
    },
    unblockPerson: (param) => {
      return dispatch(actions.unblock(param));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockAction);
