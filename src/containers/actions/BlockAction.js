import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'material-ui/styles/withStyles';
import { MenuItem } from 'material-ui/Menu';

import {
  blockActor,
  unblockActor,
} from '../../actions/block';

const styles = {
  root: {},
};

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
    const { viewer, actor } = this.props;
    this.props.blockPerson(viewer, actor);
    this.setState({
      isBlocked: true,
    });
  }

  handleUnblockActor(event) {
    event.preventDefault();
    const { viewer, actor } = this.props;
    this.props.unblockPerson(viewer, actor);
    this.setState({
      isBlocked: false,
    });
  }

  render() {
    const { classes, actor } = this.props;
    const { isBlocked } = this.state;
    return (
      <div className={classes.root}>
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
      </div>
    );
  }
}

BlockAction.propTypes = {
  classes: PropTypes.object.isRequired,
  blockPerson: PropTypes.func.isRequired,
  unblockPerson: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.authReducer;

  return {
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    blockPerson: (viewer, actor) => {
      dispatch(blockActor(viewer, actor));
    },
    unblockPerson: (viewer, actor) => {
      dispatch(unblockActor(viewer, actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockAction));
