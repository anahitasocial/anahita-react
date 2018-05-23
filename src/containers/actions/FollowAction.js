import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import {
  followActor,
  unfollowActor,
} from '../../actions/follow';

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
    const { isLeader } = this.state;
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

FollowAction.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowAction);
