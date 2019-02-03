import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../actions/block';
import PersonType from '../../proptypes/Person';

class BlockAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isBlocked: props.actor.isBlocked || false,
    };

    this.handleBlockActor = this.handleBlockActor.bind(this);
    this.handleUnblockActor = this.handleUnblockActor.bind(this);
  }

  handleBlockActor(event) {
    event.preventDefault();

    const { viewer, actor, blockPerson } = this.props;
    blockPerson(viewer, actor);

    this.setState({
      isBlocked: true,
    });
  }

  handleUnblockActor(event) {
    event.preventDefault();

    const { viewer, actor, unblockPerson } = this.props;
    unblockPerson(viewer, actor);

    this.setState({
      isBlocked: false,
    });
  }

  render() {
    const { actor } = this.props;
    const { isBlocked } = this.state;
    return (
      <React.Fragment>
        {isBlocked &&
          <MenuItem
            onClick={this.handleUnblockActor}
          >
            {`Unblock @${actor.alias}`}
          </MenuItem>
        }
        {!isBlocked &&
          <MenuItem
            onClick={this.handleBlockActor}
          >
            {`Block @${actor.alias}`}
          </MenuItem>
        }
      </React.Fragment>
    );
  }
}

BlockAction.propTypes = {
  blockPerson: PropTypes.func.isRequired,
  unblockPerson: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.auth;

  return {
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockAction);
