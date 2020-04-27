import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from './ListItem';

import LocationsType from '../../../proptypes/Locations';

const LocationsGadgetList = (props) => {
  const {
    locations = {
      byIds: {},
      allIds: [],
    },
    handleDelete,
    canDelete,
  } = props;

  return (
    <List>
      {locations.allIds.map((locationId) => {
        const location = locations.byId[locationId];
        return (
          <ListItem
            location={location}
            handleDelete={handleDelete}
            canDelete={canDelete}
          />
        );
      })}
    </List>
  );
};

LocationsGadgetList.propTypes = {
  locations: LocationsType.isRequired,
  handleDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
};

export default LocationsGadgetList;
