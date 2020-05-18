import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import ListItem from '../ListItem';
import Progress from '../../../components/Progress';
import LocationsType from '../../../proptypes/Locations';
import NodeType from '../../../proptypes/Node';
import AddAction from '../../actions/tags/location/Add';

import * as actions from '../../../actions';
import { App as APP } from '../../../constants';

const { LIMIT } = APP.BROWSE;

const LocationsBrowse = (props) => {
  const {
    browseLocations,
    resetLocations,
    locations,
    node,
    queryFilters,
    handleClose,
    error,
    isFetching,
  } = props;

  useEffect(() => {
    browseLocations({
      start: 0,
      limit: LIMIT,
      layout: 'list_selector',
      taggable_id: node.id,
      ...queryFilters,
    });

    return () => {
      resetLocations();
    };
  }, []);

  if (isFetching) {
    return (
      <Progress key="locations-progress" />
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <List>
      {locations.allIds.map((locationId) => {
        const location = locations.byId[locationId];
        return (
          <ListItem
            key={`location-graph-list-item-${locationId}`}
            location={location}
            actions={
              <AddAction
                tag={location}
                node={node}
                callback={handleClose}
              />
            }
          />
        );
      })}
    </List>
  );
};

LocationsBrowse.propTypes = {
  browseLocations: PropTypes.func.isRequired,
  resetLocations: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  locations: LocationsType.isRequired,
  node: NodeType.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

LocationsBrowse.defaultProps = {
  queryFilters: {
    q: '',
    nearby_latitude: 0,
    nearby_longitude: 0,
    locatable_id: 0,
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
