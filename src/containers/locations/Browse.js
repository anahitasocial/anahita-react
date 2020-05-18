import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroller';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import ListItem from './ListItem';
import Progress from '../../components/Progress';
import LocationsType from '../../proptypes/Locations';

import * as actions from '../../actions';
import { App as APP } from '../../constants';

const {
  LIMIT,
  SORTING: {
    TRENDING,
  },
} = APP.BROWSE;

const LocationsBrowse = (props) => {
  const {
    browseLocations,
    resetLocations,
    locations,
    error,
    hasMore,
    queryFilters,
  } = props;

  useEffect(() => {
    return () => {
      resetLocations();
    };
  }, []);

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseLocations({
      start,
      limit: LIMIT,
      ...queryFilters,
    });
  };

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <InfiniteScroll
      loadMore={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="locations-progress" />
      }
    >
      <List>
        {locations.allIds.map((locationId) => {
          const location = locations.byId[locationId];
          return (
            <ListItem location={location} />
          );
        })}
      </List>
    </InfiniteScroll>
  );
};

LocationsBrowse.propTypes = {
  browseLocations: PropTypes.func.isRequired,
  resetLocations: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  locations: LocationsType.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

LocationsBrowse.defaultProps = {
  queryFilters: {
    q: '',
    sort: TRENDING,
  },
};

const mapStateToProps = (state) => {
  const {
    locations,
    error,
    isFetching,
    hasMore,
  } = state.locations;

  return {
    locations,
    error,
    isFetching,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseLocations: (params) => {
      return dispatch(actions.locations.browse(params));
    },
    resetLocations: () => {
      return dispatch(actions.locations.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsBrowse);
