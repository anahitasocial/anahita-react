import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';

import * as actions from '../../actions';
import i18n from '../../languages';
import permissions from '../../permissions/actor';
import containersUtils from '../utils';

import PersonType from '../../proptypes/Person';
import ActorsType from '../../proptypes/Actors';

import ActorsCard from './Card';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const useStyles = makeStyles((theme) => {
  return {
    actorTitle: {
      fontSize: 16,
    },
    actorAlias: {
      fontSize: 12,
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 10,
    },
  };
});

const ActorsBrowse = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    browseActors,
    resetActors,
    namespace,
    viewer,
    width,
    actors,
    hasMore,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const { disabled, q } = queryFilters;
    const start = (page - 1) * LIMIT;
    browseActors({
      q,
      disabled,
      start,
      limit: LIMIT,
      ...queryFilters,
    }, namespace);
  };

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));

    return () => {
      resetActors();
    };
  }, [setAppTitle, resetActors, namespace]);

  const columnWidth = containersUtils.getColumnWidthPercentage(width);
  const canAdd = permissions.canAdd(viewer);

  return (
    <React.Fragment>
      {canAdd &&
        <Fab
          aria-label="Add"
          color="secondary"
          className={classes.addButton}
          component={Link}
          to={`/${namespace}/add/`}
        >
          <AddIcon />
        </Fab>
      }
      <InfiniteScroll
        loadMore={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key={`${namespace}-progress`} />
        }
      >
        <StackGrid
          columnWidth={columnWidth}
          duration={50}
          gutterWidth={16}
          gutterHeight={16}
        >
          {actors.allIds.map((actorId) => {
            const actor = actors.byId[actorId];
            const key = `${namespace}_${actor.id}`;
            return (
              <ActorsCard
                key={key}
                actor={actor}
              />
            );
          })
          }
        </StackGrid>
      </InfiniteScroll>
    </React.Fragment>
  );
};

ActorsBrowse.propTypes = {
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
  setAppTitle: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

ActorsBrowse.defaultProps = {
  queryFilters: {
    q: '',
    disabled: false,
  },
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      hasMore,
    } = state[namespace];

    const {
      viewer,
    } = state.session;

    return {
      actors: state[namespace][namespace],
      namespace,
      error,
      hasMore,
      viewer,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseActors: (params) => {
        return dispatch(actions[namespace].browse(params, namespace));
      },
      resetActors: () => {
        return dispatch(actions[namespace].reset(namespace));
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
  )(withWidth()(ActorsBrowse));
};
