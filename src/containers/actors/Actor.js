import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import striptags from 'striptags';

import ActorProfile from '../../components/ActorProfile';
import StoriesContainer from '../stories/Stories';
import ActorAvatar from './ActorAvatar';
import ActorCover from './ActorCover';
import ActorCommands from './ActorCommands';
import FollowAction from '../actions/Follow';
import appActions from '../../actions/app';
import actions from '../../actions/actor';
import i18n from '../../languages';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';
import PersonType from '../../proptypes/Person';

const styles = (theme) => {
  return {
    progress: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
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
      actor: ActorDefault,
    };

    const {
      match: {
        params: {
          id,
        },
      },
    } = props;
    this.id = id;
  }

  componentWillMount() {
    const { namespace, readActor, setAppTitle } = this.props;
    readActor(this.id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }

  componentWillReceiveProps(nextProps) {
    const { actors } = nextProps;
    this.setState({
      actor: actors.current,
    });
  }

  componentWillUnmount() {
    const { resetActors } = this.props;
    resetActors();
  }

  canFollow(actor) {
    const {
      viewer,
      isAuthenticated,
    } = this.props;

    return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
  }

  render() {
    const {
      classes,
      isAuthenticated,
      viewer,
      isFetchingAvatar,
      isFetchingCover,
    } = this.props;

    const { actor } = this.state;

    const canFollow = this.canFollow(actor);

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {actor.name}
          </title>
          <meta name="description" content={striptags(actor.body)} />
        </Helmet>
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
        {actor.id &&
          <StoriesContainer
            key="com:stories.story"
            queryFilters={{
              oid: actor.id,
            }}
            {...this.params}
          />
        }
      </React.Fragment>
    );
  }
}

ActorPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isFetchingAvatar: PropTypes.bool,
  isFetchingCover: PropTypes.bool,
  match: PropTypes.object.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

ActorPage.defaultProps = {
  isAuthenticated: false,
  isFetchingAvatar: false,
  isFetchingCover: false,
};

const mapStateToProps = (state) => {
  const {
    actors,
    error,
    isLeader,
    isFetching,
    isFetchingAvatar,
    isFetchingCover,
  } = state.actors;

  const {
    isAuthenticated,
    viewer,
  } = state.auth;

  return {
    actors,
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
    resetActors: () => {
      dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorPage));
