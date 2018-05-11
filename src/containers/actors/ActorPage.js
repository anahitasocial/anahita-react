import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import ActorProfile from '../../components/ActorProfile';
import ActorAvatar from './ActorAvatar';
import ActorCover from './ActorCover';
import ActorCommands from './ActorCommands';
import FollowAction from '../actions/FollowAction';
import { readActor } from '../../actions/actor';

const styles = theme => ({
  root: {
    width: '100%',
  },
});

class ActorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actor: props.actor,
    };
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.readActor(id, this.props.namespace);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      actor: Object.assign({}, nextProps.actor),
    });
  }

  canFollow(actor) {
    const {
      viewer,
      isAuthenticated,
    } = this.props;

    return isAuthenticated &&
    (viewer.id !== actor.id) &&
    !actor.isBlocked;
  }

  renderProfile(actor) {
    const canFollow = this.canFollow(actor);
    const {
      isAuthenticated,
      viewer,
      isFetching,
    } = this.props;
    return (
      <ActorProfile
        cover={
          <ActorCover
            actor={actor}
            viewer={viewer}
            isFetching={isFetching}
          />
        }
        avatar={
          <ActorAvatar
            actor={actor}
            viewer={viewer}
            isFetching={isFetching}
          />
        }
        name={actor.name}
        description={actor.body}
        alias={actor.alias}
        followAction={canFollow && <FollowAction actor={actor} />}
        headerAction={isAuthenticated && <ActorCommands actor={actor} />}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { actor } = this.state;

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
  actor: PropTypes.object,
  viewer: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool,
};

ActorPage.defaultProps = {
  actor: {
    id: null,
    name: '',
    body: '',
  },
  isAuthenticated: false,
  isFetching: false,
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
    isLeader,
    isFetching,
  } = state.actorReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    actor,
    isLeader,
    error,
    isAuthenticated,
    viewer,
    isFetching,
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
