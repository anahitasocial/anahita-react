import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import striptags from 'striptags';

import ActorProfile from '../../components/actor/Profile';
import StoriesBrowse from '../stories/Browse';
import Avatar from './read/Avatar';
import Cover from './read/Cover';
import Commands from './read/Commands';
import FollowAction from '../actions/Follow';
import appActions from '../../actions/app';
import actions from '../../actions/actor';
import i18n from '../../languages';
import permissions from '../../permissions/actor';

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

class ActorsRead extends React.Component {
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

  render() {
    const {
      classes,
      isAuthenticated,
      viewer,
    } = this.props;

    const { actor } = this.state;

    const canFollow = permissions.canFollow(isAuthenticated, viewer, actor);
    const canEdit = permissions.canEdit(viewer, actor);

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
            <Cover
              node={actor}
              canEdit={canEdit}
            />
          }
          avatar={
            <Avatar
              node={actor}
              canEdit={canEdit}
            />
          }
          name={actor.name}
          description={actor.body}
          alias={actor.alias}
          followAction={canFollow && actor.id && <FollowAction actor={actor} />}
          headerActions={isAuthenticated && actor.id && <Commands actor={actor} />}
        />
        <Divider className={classes.divider} />
        {actor.id &&
          <StoriesBrowse
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

ActorsRead.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isFetchingCover: PropTypes.bool,
  match: PropTypes.object.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

ActorsRead.defaultProps = {
  isAuthenticated: false,
  isFetchingCover: false,
};

const mapStateToProps = (state) => {
  const {
    actors,
    error,
    isLeader,
    isFetching,
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
)(ActorsRead));
