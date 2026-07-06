import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions/socialgraph';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const ControlsBlock = React.forwardRef((props, ref) => {
  const {
    blockPerson,
    unblockPerson,
    actor,
    component,
    blockLabel,
    unblockLabel,
    viewer,
  } = props;

  const [blocked, setBlocked] = useState(actor.isBlockedByViewer);
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

ControlsBlock.propTypes = {
  blockPerson: PropTypes.func.isRequired,
  unblockPerson: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  component: PropTypes.oneOf(['button', 'menuitem']),
  blockLabel: PropTypes.string,
  unblockLabel: PropTypes.string,
  viewer: PersonType.isRequired,
};

ControlsBlock.defaultProps = {
  component: 'button',
  blockLabel: i18n.t('actions:block'),
  unblockLabel: i18n.t('actions:unblock'),
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
)(ControlsBlock);
