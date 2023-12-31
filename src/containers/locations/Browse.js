import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';

import ListItem from './ListItem';
import Progress from '../../components/Progress';
import LocationsType from '../../proptypes/Locations';

import actions from '../../actions';
import { App as APP } from '../../constants';

const {
  LIMIT,
  SORTING: {
    TRENDING,
  },
} = APP.BROWSE;

const LocationsBrowse = (props) => {
  const {
    browseList,
    resetList,
    alertError,
    items,
    error,
    isFetching,
    queryFilters,
    total,
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
      });
    }
  }, [start, queryFilters]);

  useEffect(() => {
    if (error) {
      alertError(error);
    }
  }, [error]);

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  const hasMore = total > items.allIds.length;

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
  isFetching: PropTypes.bool.isRequired,
  total: PropTypes.number,
};

LocationsBrowse.defaultProps = {
  queryFilters: {
    q: '',
    sort: TRENDING,
  },
  total: 0,
};

const mapStateToProps = (state) => {
  const {
    locations: items,
    error,
    isFetching,
    total,
  } = state.locations;

  return {
    items,
    error,
    isFetching,
    total,
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
