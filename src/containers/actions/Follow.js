import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import actions from '../../actions/follow';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

class FollowAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLeader: false,
      isWaiting: false,
    };

    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
  }

  componentWillMount() {
    const { actor } = this.props;

    this.setState({
      isLeader: actor.isLeader,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { actor } = nextProps;

    this.setState({
      isLeader: actor.isLeader,
      isWaiting: false,
    });
  }

  handleFollow(event) {
    event.preventDefault();

    const {
      viewer,
      actor,
      followActor,
    } = this.props;

    followActor(viewer, actor);

    this.setState({ isWaiting: true });
  }

  handleUnfollow(event) {
    event.preventDefault();

    const {
      viewer,
      actor,
      unfollowActor,
    } = this.props;

    unfollowActor(viewer, actor);

    this.setState({ isWaiting: true });
  }

  render() {
    const { isLeader, isWaiting } = this.state;
    const title = isLeader ? i18n.t('actions:unfollow') : i18n.t('actions:follow');
    const onClick = isLeader ? this.handleUnfollow : this.handleFollow;
    const color = isLeader ? 'inherit' : 'primary';
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

FollowAction.propTypes = {
  followActor: PropTypes.func.isRequired,
  unfollowActor: PropTypes.func.isRequired,
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
    followActor: (viewer, actor) => {
      dispatch(actions.follow(viewer, actor));
    },
    unfollowActor: (viewer, actor) => {
      dispatch(actions.unfollow(viewer, actor));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowAction);
