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

const DEFAULT_FILTERS = {
  q: '',
  disabled: false,
  oid: 0,
  filter: '',
};

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

const ActorsBrowse = ({
  browseList,
  resetList,
  namespace,
  viewer,
  items,
  queryFilters = DEFAULT_FILTERS,
  total = 0,
}) => {
  const classes = useStyles();

  const {
    q = '',
    disabled = false,
    oid = 0,
    filter = '',
  } = queryFilters;

  const [start, setStart] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setStart(0);
  }, [q, disabled, oid, filter, namespace]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    browseList({
      start,
      limit: LIMIT,
      q,
      disabled,
      oid,
      filter,
    }, namespace);
  }, [start, q, disabled, oid, filter, namespace]);

  const fetchList = () => {
    setStart(start + LIMIT);
  };

  const canAdd = permissions.canAdd(viewer, namespace);
  const hasMore = total > items.allIds.length;

  return (
    <>
      {canAdd && (
        <Fab
          aria-label="Add"
          color="secondary"
          className={classes.addButton}
          component={Link}
          to={`/${namespace}/add/`}
        >
          <AddIcon />
        </Fab>
      )}
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
  total: PropTypes.number,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      total,
      isFetching,
    } = state[namespace];

    const {
      viewer,
    } = state.session;

    return {
      items: state[namespace][namespace],
      namespace,
      error,
      isFetching,
      viewer,
      total,
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
