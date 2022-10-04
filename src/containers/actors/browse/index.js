import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import actions from '../../../actions';
import permissions from '../../../permissions/actor';

import PersonType from '../../../proptypes/Person';
import ActorsType from '../../../proptypes/Actors';

import ActorsCard from './Card';
import Masonry from '../../../components/BreakpointMasonry';
import Progress from '../../../components/Progress';
import { App as APP } from '../../../constants';

const { LIMIT } = APP.BROWSE;

const useStyles = makeStyles((theme) => {
  return {
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 10,
    },
    card: {
      marginBottom: theme.spacing(2),
    },
  };
});

const ActorsBrowse = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    namespace,
    viewer,
    items,
    hasMore,
    isFetching,
    queryFilters,
  } = props;

  const [start, setStart] = useState(0);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    if (!isFetching) {
      browseList({
        start,
        limit: LIMIT,
        ...queryFilters,
      }, namespace);
    }
  }, [start]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  const canAdd = permissions.canAdd(viewer, namespace);

  return (
    <>
      {canAdd &&
        <Fab
          aria-label="Add"
          color="secondary"
          className={classes.addButton}
          component={Link}
          to={`/${namespace}/add/`}
        >
          <AddIcon />
        </Fab>}
      <InfiniteScroll
        dataLength={items.allIds.length}
        next={fetchList}
        hasMore={hasMore}
        loader={
          <Progress key={`${namespace}-progress`} />
        }
      >
        <Masonry>
          {items.allIds.map((itemId) => {
            const node = items.byId[itemId];
            const key = `${namespace}_node_list_item_${node.id}`;
            return (
              <div
                className={classes.card}
                key={key}
              >
                <ActorsCard actor={node} viewer={viewer} />
              </div>
            );
          })}
        </Masonry>
      </InfiniteScroll>
    </>
  );
};

ActorsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  items: ActorsType.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

ActorsBrowse.defaultProps = {
  queryFilters: {
    q: '',
    disabled: false,
    oid: 0,
    filter: '',
  },
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      hasMore,
      isFetching,
    } = state[namespace];

    const {
      viewer,
    } = state.session;

    return {
      items: state[namespace][namespace],
      namespace,
      error,
      hasMore,
      isFetching,
      viewer,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseList: (params) => {
        return dispatch(actions[namespace].browse(params));
      },
      resetList: () => {
        return dispatch(actions[namespace].reset());
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsBrowse);
};
