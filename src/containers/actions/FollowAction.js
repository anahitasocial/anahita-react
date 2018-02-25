import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button';

import {
  followPerson,
  unfollowPerson,
} from '../../actions/socialgraph';

const styles = theme => ({
  root: {},
  followButton: {},
  unfollowButton: {},
});

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
    this.props.followPerson(viewer, actor);
    this.setState({
      isLeader: true,
    });
  }

  handleUnfollowActor(event) {
    event.preventDefault();
    const { viewer, actor } = this.props;
    this.props.unfollowPerson(viewer, actor);
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
            className={classes.unfollowButton}
          >
            Unfollow
          </Button>
        }
        {!isLeader &&
          <Button
            color="primary"
            className={classes.followButton}
            onClick={this.handleFollowActor}
          >
            Follow
          </Button>
        }
      </div>
    );
  }
}

FollowAction.propTypes = {
  classes: PropTypes.object.isRequired,
  followPerson: PropTypes.func.isRequired,
  unfollowPerson: PropTypes.func.isRequired,
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
    followPerson: (viewer, actor) => {
      dispatch(followPerson(viewer, actor));
    },
    unfollowPerson: (viewer, actor) => {
      dispatch(unfollowPerson(viewer, actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowAction));
