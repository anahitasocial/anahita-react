import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import ActorProfile from '../../components/ActorProfile';
import StoriesContainer from '../stories/Stories';
import ActorAvatar from './ActorAvatar';
import ActorCover from './ActorCover';
import ActorCommands from './ActorCommands';
import FollowAction from '../actions/FollowAction';
import actions from '../../actions/actor';

import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';

const styles = (theme) => {
  return {
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    divider: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
  };
};

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
      actor: { ...nextProps.actor },
    });
  }

  canFollow(actor) {
    const {
      viewer,
      isAuthenticated,
    } = this.props;

    return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
  }

  renderProfile(actor) {
    const canFollow = this.canFollow(actor);
    const {
      classes,
      isAuthenticated,
      viewer,
      isFetchingAvatar,
      isFetchingCover,
    } = this.props;

    const filters = {
      oid: actor.id,
    };

    return (
      <React.Fragment>
        <ActorProfile
          cover={
            <ActorCover
              actor={actor}
              viewer={viewer}
              isFetching={isFetchingCover}
            />
          }
          avatar={
            <ActorAvatar
              actor={actor}
              viewer={viewer}
              isFetching={isFetchingAvatar}
            />
          }
          name={actor.name}
          description={actor.body}
          alias={actor.alias}
          followAction={canFollow && <FollowAction actor={actor} />}
          headerAction={isAuthenticated && <ActorCommands actor={actor} />}
        />
        <Divider className={classes.divider} />
        <StoriesContainer
          key="com:stories.story"
          queryFilters={filters}
          {...this.params}
        />
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;
    const { actor } = this.state;

    return (
      <div className={classes.root}>
        {!actor.id &&
          <CircularProgress className={classes.progress} />
        }
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
  actor: ActorType,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
  isFetchingAvatar: PropTypes.bool,
  isFetchingCover: PropTypes.bool,
  match: PropTypes.object.isRequired,
};

ActorPage.defaultProps = {
  actor: {},
  isAuthenticated: false,
  isFetchingAvatar: false,
  isFetchingCover: false,
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
    isLeader,
    isFetching,
    isFetchingAvatar,
    isFetchingCover,
  } = state.actor;

  const {
    isAuthenticated,
    viewer,
  } = state.auth;

  return {
    actor,
    isLeader,
    error,
    isAuthenticated,
    viewer,
    isFetching,
    isFetchingAvatar,
    isFetchingCover,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(actions.read(id, namespace));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorPage));
