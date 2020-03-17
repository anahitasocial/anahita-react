import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';

import Progress from '../../components/Progress';
import ActorHeader from '../../components/actor/Header';
import ActorBody from '../../components/actor/Body';
import StoriesBrowse from '../stories/Browse';
import MediaBrowse from '../media/Browse';
import Avatar from './read/Avatar';
import Cover from './read/Cover';
import Commands from './read/Commands';
import FollowAction from '../actions/Follow';
import appActions from '../../actions/app';
import * as actions from '../../actions';
import i18n from '../../languages';
import permissions from '../../permissions/actor';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';
import PersonType from '../../proptypes/Person';
import SocialgraphTabs from '../../components/actor/socialgraph/Tabs';
import ActorsSocialgraph from './Socialgraph';
import LocationsGadget from '../locations/Gadget';

const NotesBrowse = MediaBrowse('notes');
const PhotosBrowse = MediaBrowse('photos');
const ArticlesBrowse = MediaBrowse('articles');
const TopicsBrowse = MediaBrowse('topics');
const TodosBrowse = MediaBrowse('todos');

const ActorsRead = (props) => {
  const {
    namespace,
    readActor,
    resetActors,
    setAppTitle,
    actors,
    viewer,
    isAuthenticated,
    match: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
    readActor(id, namespace);

    return () => {
      resetActors();
    };
  }, []);

  const actor = actors.current || { ...ActorDefault };

  const canFollow = permissions.canFollow(isAuthenticated, viewer, actor);
  const canEdit = permissions.canEdit(viewer, actor);
  const isPerson = actor.objectType.split('.')[1] === 'people';
  const isViewer = actor.id === viewer.id;
  const metaDesc = striptags(actor.body).substr(0, 160);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {actor.name}
        </title>
        <meta name="description" content={metaDesc} />
      </Helmet>
      {!actor.id && <Progress />}
      {actor.id &&
      <React.Fragment>
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
        <ActorBody
          actor={actor}
          viewer={viewer}
          stories={
            <StoriesBrowse
              key="com:stories.story"
              queryFilters={{
                oid: actor.id,
              }}
              {...this.params}
            />
          }
          locations={
            <LocationsGadget node={actor} />
          }
          socialgraph={
            <SocialgraphTabs
              followers={
                <ActorsSocialgraph
                  actor={actor}
                  filter="followers"
                />
              }
              leaders={isPerson &&
                <ActorsSocialgraph
                  actor={actor}
                  filter="leaders"
                />
              }
              blocked={isViewer &&
                <ActorsSocialgraph
                  actor={actor}
                  filter="blocked"
                />
              }
              mutuals={!isViewer && isPerson &&
                <ActorsSocialgraph
                  actor={actor}
                  filter="mutuals"
                />
              }
            />
          }
          notes={
            <NotesBrowse
              queryFilters={{
                oid: actor.id,
              }}
            />
          }
          photos={
            <PhotosBrowse
              queryFilters={{
                oid: actor.id,
              }}
            />
          }
          articles={
            <ArticlesBrowse
              queryFilters={{
                oid: actor.id,
              }}
            />
          }
          topics={
            <TopicsBrowse
              queryFilters={{
                oid: actor.id,
              }}
            />
          }
          todos={
            <TodosBrowse
              queryFilters={{
                oid: actor.id,
              }}
            />
          }
        />
      </React.Fragment>
      }
    </React.Fragment>
  );
};

ActorsRead.propTypes = {
  readActor: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
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
        return dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        return dispatch(actions[namespace].reset());
      },
      setAppTitle: (title) => {
        return dispatch(appActions.setAppTitle(title));
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
