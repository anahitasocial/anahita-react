import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';
import striptags from 'striptags';

import ActorHeader from '../../components/actor/Header';
import ActorBody from '../../components/actor/Body';
import StoriesBrowse from '../stories/Browse';
import Avatar from './read/Avatar';
import Cover from './read/Cover';
import Commands from './read/Commands';
import FollowAction from '../actions/Follow';
import appActions from '../../actions/app';
import * as actions from '../../actions';
import i18n from '../../languages';
import permissions from '../../permissions/actor';

import ActorDefault from '../../proptypes/ActorDefault';
import PersonType from '../../proptypes/Person';

const styles = (theme) => {
  return {
    progress: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  };
};

class ActorsRead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: { ...ActorDefault },
    };

    const {
      namespace,
      readActor,
      setAppTitle,
      match: {
        params: {
          id,
        },
      },
    } = props;

    readActor(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }

  static getDerivedStateFromProps(nextProps) {
    const { actors } = nextProps;
    return {
      actor: actors.current,
    };
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
        <ActorHeader
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
          actor={actor}
          followAction={canFollow && actor.id && <FollowAction actor={actor} />}
          headerActions={isAuthenticated && actor.id && <Commands actor={actor} />}
        />
        {actor.id &&
          <ActorBody
            actor={actor}
            stories={
              <StoriesBrowse
                key="com:stories.story"
                queryFilters={{
                  oid: actor.id,
                }}
                {...this.params}
              />
            }
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
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      error,
    } = state[namespace];

    const {
      isAuthenticated,
      viewer,
    } = state.session;

    return {
      actors: state[namespace][namespace],
      namespace,
      error,
      isAuthenticated,
      viewer,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readActor: (id) => {
        dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        dispatch(actions[namespace].reset());
      },
      setAppTitle: (title) => {
        dispatch(appActions.setAppTitle(title));
      },
    };
  };
};

export default (namespace) => {
  return withStyles(styles)(connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsRead));
};
