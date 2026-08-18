import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';

import ListItem from './ListItem';
import Progress from '../../../components/Progress';
import LocationsType from '../../../proptypes/Locations';

import actions from '../../../actions';
import { App as APP } from '../../../constants';

const {
  LIMIT,
  SORTING: {
    TRENDING,
  },
} = APP.BROWSE;

const DEFAULT_FILTERS = {
  q: '',
  sort: TRENDING,
};

const LocationsBrowse = ({
  browseList,
  resetList,
  alertError,
  items,
  error,
  queryFilters = DEFAULT_FILTERS,
  total = 0,
  isFetching = false,
}) => {
  const {
    q = '',
    sort = TRENDING,
  } = queryFilters;

  const queryKey = `${q}|${sort}`;

  // `start` is derived during render so it can never lag behind a query
  // change — see the note in containers/actors/Browse/index.jsx.
  const [page, setPage] = useState({ key: queryKey, start: 0 });
  const start = page.key === queryKey ? page.start : 0;

  const isMounted = useRef(false);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  // Discard the previous sort's items when the query changes. Declared before
  // the fetch effect so the reset is always dispatched ahead of the new
  // request, which also marks any still in-flight response as stale.
  useEffect(() => {
    if (isMounted.current) {
      resetList();
      setPage({ key: queryKey, start: 0 });
    } else {
      isMounted.current = true;
    }
  }, [queryKey]);

  useEffect(() => {
    browseList({
      start,
      limit: LIMIT,
      time_window: sort === TRENDING ? 'weekly' : undefined,
      ...queryFilters,
    });
  }, [start, queryKey]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  const hasMore = total > items.allIds.length;

  const fetchList = () => {
    // InfiniteScroll listens on the window, so a scroll event can arrive while
    // a page is still in flight.
    if (isFetching || !hasMore) {
      return;
    }

    setPage({ key: queryKey, start: start + LIMIT });
  };

  return (
    <InfiniteScroll
      dataLength={items.allIds.length}
      next={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="items-progress" />
      }
    >
      <List>
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          const key = `locations_node_list_item_${itemId}`;
          return (
            <ListItem location={node} key={key} />
          );
        })}
      </List>
    </InfiniteScroll>
  );
};

LocationsBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  items: LocationsType.isRequired,
  error: PropTypes.string.isRequired,
  total: PropTypes.number,
  isFetching: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    locations: items,
    error,
    total,
    isFetching,
  } = state.locations;

  return {
    items,
    error,
    total,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.locations.browse(params));
    },
    resetList: () => {
      return dispatch(actions.locations.reset());
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsBrowse);
