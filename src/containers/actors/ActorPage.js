import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import ActorProfile from '../../components/ActorProfile';
import ActorCommands from './ActorCommands';
import FollowAction from '../actions/FollowAction';
import {
  readActor,
} from '../../actions/actor';

const styles = theme => ({
  root: {
    width: '100%',
  },
});

class ActorPage extends React.Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.readActor(id, this.props.namespace);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.readActor(nextProps.match.params.id, nextProps.namespace);
    }
  }

  canFollow(actor) {
    const { viewer, isAuthenticated } = this.props;
    return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
  }

  renderProfile(actor) {
    const cover = actor.coverURL.large && actor.coverURL.large.url;
    const avatar = actor.imageURL.large && actor.imageURL.large.url;
    const canFollow = this.canFollow(actor);
    return (
      <ActorProfile
        cover={cover}
        avatar={avatar}
        name={actor.name}
        description={actor.body}
        alias={actor.alias}
        followAction={canFollow && <FollowAction actor={actor} />}
        headerAction={<ActorCommands actor={actor} />}
      />
    );
  }

  render() {
    const {
      classes,
      actor,
    } = this.props;

    return (
      <div className={classes.root}>
        {actor.id &&
          this.renderProfile(actor)
        }
      </div>
    );
  }
}

ActorPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  actor: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
};

ActorPage.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => {
  const {
    actor,
    errorMessage,
    isLeader,
  } = state.actorReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    actor,
    isLeader,
    errorMessage,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(readActor(id, namespace));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorPage));
