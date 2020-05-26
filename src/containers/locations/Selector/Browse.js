import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ListItem from '../ListItem';
import Progress from '../../../components/Progress';
import LocationsType from '../../../proptypes/Locations';
import NodeType from '../../../proptypes/Node';
import AddAction from '../../actions/tags/location/Add';

import * as actions from '../../../actions';
import { App as APP } from '../../../constants';

const { LIMIT } = APP.BROWSE;

const LocationsSelectorBrowse = (props) => {
  const {
    browseLocations,
    resetLocations,
    noResultsCallback,
    locations,
    node,
    queryFilters,
    handleClose,
    error,
    isFetching,
  } = props;

  const [keyword, setKeyword] = useState('');

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

  const handleOnChange = (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    resetLocations();
    browseLocations({
      start: 0,
      limit: LIMIT,
      layout: 'list_selector',
      taggable_id: node.id,
      q: keyword,
    });
  };

  if (keyword !== '' && !isFetching && locations.allIds.length === 0 && noResultsCallback) {
    noResultsCallback(keyword);
  }

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
    <React.Fragment>
      <form onSubmit={handleOnSubmit}>
        <FormControl
          fullWidth
          style={{
            padding: 16,
          }}
        >
          <TextField
            name="keyword"
            value={keyword}
            onChange={handleOnChange}
            variant="outlined"
            placeholder="Search location ..."
            fullWidth
          />
        </FormControl>
      </form>
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
    </React.Fragment>
  );
};

LocationsSelectorBrowse.propTypes = {
  browseLocations: PropTypes.func.isRequired,
  resetLocations: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  locations: LocationsType.isRequired,
  node: NodeType.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  noResultsCallback: PropTypes.func,
};

LocationsSelectorBrowse.defaultProps = {
  queryFilters: {
    q: '',
    nearby_latitude: 0,
    nearby_longitude: 0,
    locatable_id: 0,
  },
  noResultsCallback: null,
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
)(LocationsSelectorBrowse);
