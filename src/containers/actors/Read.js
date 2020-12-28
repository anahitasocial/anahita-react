import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';

import Progress from '../../components/Progress';
import ActorHeader from '../../components/actor/Header';
import ActorBody from '../../components/actor/Body';
import StoriesBrowse from '../stories/Browse';
import Media from '../media/Browse';
import Avatar from './read/Avatar';
import Cover from './read/Cover';
import Commands from './read/Commands';
import FollowAction from '../actions/Follow';
import * as actions from '../../actions';
import i18n from '../../languages';
import permissions from '../../permissions/actor';
import utils from '../../utils';

import ActorsType from '../../proptypes/Actors';
import PersonType from '../../proptypes/Person';
import SocialgraphTabs from '../../components/actor/socialgraph/Tabs';
import ActorsFollowRequests from './FollowRequests';
import ActorsSocialgraph from './Socialgraph';
import LocationsGadget from '../locations/Gadget';

const Articles = Media('articles');
const Documents = Media('documents');
const Notes = Media('notes');
const Photos = Media('photos');
const Topics = Media('topics');
const Todos = Media('todos');

const ActorsRead = (props) => {
  const {
    namespace,
    readItem,
    resetList,
    setAppTitle,
    items: {
      current: actor,
    },
    viewer,
    isFetching,
    error,
    match: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
    readItem(id, namespace);

    return () => {
      resetList();
    };
  }, [setAppTitle, readItem, resetList, id, namespace]);

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  if (!actor.id && error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

  const canFollow = permissions.canFollow(actor);
  const canEdit = permissions.canEdit(actor);
  const canAdminister = permissions.canAdminister(actor);
  const canViewCommands = permissions.canViewCommands(actor, [
    'follow',
    'unfollow',
    'notifications-settings',
  ]);

  const isPerson = utils.node.isPerson(actor);
  const isViewer = actor.id === viewer.id;
  const metaDesc = striptags(actor.body).substr(0, 160);
  const FollowRequests = ActorsFollowRequests(namespace);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {actor.name}
        </title>
        <meta name="description" content={metaDesc} />
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
        followAction={
          <React.Fragment>
            {canAdminister && <FollowRequests actor={actor} />}
            {canFollow && <FollowAction actor={actor} />}
          </React.Fragment>
        }
        headerActions={canViewCommands &&
          <Commands actor={actor} />
        }
      />
      <ActorBody
        actor={actor}
        viewer={viewer}
        stories={actor.id &&
          <StoriesBrowse
            key="com:stories.story"
            queryFilters={{
              oid: actor.id,
            }}
            {...this.params}
          />
        }
        locations={actor.id &&
          <LocationsGadget node={actor} />
        }
        socialgraph={
          <SocialgraphTabs
            followers={actor.id &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="followers"
              />
            }
            leaders={actor.id && isPerson &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="leaders"
              />
            }
            blocked={actor.id && isViewer &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="blocked"
              />
            }
            mutuals={actor.id && !isViewer && isPerson &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="mutuals"
              />
            }
          />
        }
        articles={actor.id &&
          <Articles
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
        documents={actor.id &&
          <Documents
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
        notes={actor.id &&
          <Notes
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
        photos={actor.id &&
          <Photos
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
        topics={actor.id &&
          <Topics
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
        todos={actor.id &&
          <Todos
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
      />
    </React.Fragment>
  );
};

ActorsRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  items: ActorsType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
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
      items: state[namespace][namespace],
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
      readItem: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      resetList: () => {
        return dispatch(actions[namespace].reset());
      },
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsRead);
};
