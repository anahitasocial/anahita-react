import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions/socialgraph';
import ActorsType from '../../proptypes/Actors';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

class BlockAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isBlocked: false,
      isWaiting: false,
    };

    this.handleBlock = this.handleBlock.bind(this);
    this.handleUnblock = this.handleUnblock.bind(this);
  }

  componentWillMount() {
    const { actor, actors } = this.props;
    const isBlocked = actors.byId[actor.id] ? actors.byId[actor.id].isBlocked : actor.isBlocked;
    this.setState({ isBlocked });
  }

  componentWillReceiveProps(nextProps) {
    const { actors, actor } = nextProps;

    if (actors.byId[actor.id]) {
      this.setState({
        isBlocked: actors.byId[actor.id].isBlocked,
        isWaiting: false,
      });
    }
  }

  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  handleBlock(event) {
    event.preventDefault();

    const { viewer, actor, blockPerson } = this.props;

    blockPerson(viewer, actor);

    this.setState({ isBlocked: true });
  }

  handleUnblock(event) {
    event.preventDefault();

    const { viewer, actor, unblockPerson } = this.props;

    unblockPerson(viewer, actor);

    this.setState({ isBlocked: false });
  }

  render() {
    const {
      component,
      blockLabel,
      unblockLabel,
    } = this.props;

    const { isBlocked, isWaiting } = this.state;
    const title = isBlocked ? unblockLabel : blockLabel;
    const onClick = isBlocked ? this.handleUnblock : this.handleBlock;
    const color = isBlocked ? 'secondary' : 'inherit';

    if (component === 'menuitem') {
      return (
        <MenuItem
          onClick={onClick}
          disabled={isWaiting}
          color={color}
        >
          {title}
        </MenuItem>
      );
    }

    return (
      <Button
        onClick={onClick}
        disabled={isWaiting}
        color={color}
      >
        {title}
      </Button>
    );
  }
}

BlockAction.propTypes = {
  blockPerson: PropTypes.func.isRequired,
  unblockPerson: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  actors: ActorsType.isRequired,
  viewer: PersonType.isRequired,
  component: PropTypes.oneOf(['button', 'menuitem']),
  blockLabel: PropTypes.string,
  unblockLabel: PropTypes.string,
};

BlockAction.defaultProps = {
  component: 'button',
  blockLabel: i18n.t('actions:block'),
  unblockLabel: i18n.t('actions:unblock'),
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.session;

  const {
    actors,
  } = state.socialgraph;

  return {
    actors,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    blockPerson: (viewer, actor) => {
      dispatch(actions.block(viewer, actor));
    },
    unblockPerson: (viewer, actor) => {
      dispatch(actions.unblock(viewer, actor));
    },
    reset: () => {
      dispatch(actions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockAction);
