import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';

import {
  followActor,
  unfollowActor,
} from '../../actions/follow';

const styles = {
  root: {},
};

class FollowAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLeader: props.actor.isLeader || false,
    };

    this.handleFollowActor = this.handleFollowActor.bind(this);
    this.handleUnfollowActor = this.handleUnfollowActor.bind(this);
  }

  handleFollowActor(event) {
    event.preventDefault();
    const { viewer, actor } = this.props;
    this.props.followActor(viewer, actor);
    this.setState({
      isLeader: true,
    });
  }

  handleUnfollowActor(event) {
    event.preventDefault();
    const { viewer, actor } = this.props;
    this.props.unfollowActor(viewer, actor);
    this.setState({
      isLeader: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { isLeader } = this.state;
    return (
      <div className={classes.root}>
        {isLeader &&
          <Button
            color="inherit"
            onClick={this.handleUnfollowActor}
          >
            {'Unfollow'}
          </Button>
        }
        {!isLeader &&
          <Button
            color="primary"
            onClick={this.handleFollowActor}
          >
            {'Follow'}
          </Button>
        }
      </div>
    );
  }
}

FollowAction.propTypes = {
  classes: PropTypes.object.isRequired,
  followActor: PropTypes.func.isRequired,
  unfollowActor: PropTypes.func.isRequired,
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
    followActor: (viewer, actor) => {
      dispatch(followActor(viewer, actor));
    },
    unfollowActor: (viewer, actor) => {
      dispatch(unfollowActor(viewer, actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowAction));
