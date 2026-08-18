import React, { useEffect, useRef, useState } from 'react';
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
  isFetching = false,
}) => {
  const classes = useStyles();

  const {
    q = '',
    disabled = false,
    oid = 0,
    filter = '',
  } = queryFilters;

  const queryKey = `${namespace}|${q}|${disabled}|${oid}|${filter}`;

  // Pagination is tied to the query it belongs to, and `start` is derived
  // during render rather than reset from an effect. Resetting it in an effect
  // would leave one commit in which the query is new but `start` is still the
  // old page, and the fetch effect below would fire a request for that page.
  const [page, setPage] = useState({ key: queryKey, start: 0 });
  const start = page.key === queryKey ? page.start : 0;

  const isMounted = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  // Discard the previous query's items when the query changes. Declared before
  // the fetch effect so the reset is always dispatched ahead of the new
  // request, which also marks any still in-flight response as stale.
  useEffect(() => {
    if (isMounted.current) {
      resetList();
      // Re-key the pagination so returning to a previously visited query does
      // not resume from that query's old offset.
      setPage({ key: queryKey, start: 0 });
    } else {
      isMounted.current = true;
    }
  }, [queryKey]);

  // Fetch data when pagination or the query changes
  useEffect(() => {
    browseList({
      start,
      limit: LIMIT,
      q,
      disabled,
      oid,
      filter,
    }, namespace);
  }, [start, queryKey]);

  const canAdd = permissions.canAdd(viewer, namespace);
  const hasMore = total > items.allIds.length;

  const fetchList = () => {
    // InfiniteScroll listens on the window, so a scroll event can arrive while
    // a page is still in flight — most notably right after a tab switch, when
    // the browser clamps the scroll position of a now-empty list.
    if (isFetching || !hasMore) {
      return;
    }

    setPage({ key: queryKey, start: start + LIMIT });
  };

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
  isFetching: PropTypes.bool,
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

// Callers invoke this from inside their render bodies. Returning a new
// component type each time would make React unmount and remount the list — and
// therefore reset and refetch it — on every unrelated re-render of the parent.
const connectedByNamespace = {};

export default (namespace) => {
  if (!connectedByNamespace[namespace]) {
    connectedByNamespace[namespace] = connect(
      mapStateToProps(namespace),
      mapDispatchToProps(namespace),
    )(ActorsBrowse);
  }

  return connectedByNamespace[namespace];
};
