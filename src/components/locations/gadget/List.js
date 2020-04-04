import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import DeleteIcon from '@material-ui/icons/Clear';
import LocationIcon from '@material-ui/icons/LocationOn';

import LocationsType from '../../../proptypes/Locations';

const LocationsGadgetList = (props) => {
  const {
    locations = {
      byIds: {},
      allIds: [],
    },
    handleDelete,
  } = props;

  return (
    <List>
      {locations.allIds.map((locationId) => {
        const location = locations.byId[locationId];
        return (
          <ListItem
            key={`locations-gadget-list-item-${location.id}`}
            button
            component="a"
            href={`/locations/${location.id}-${location.alias}/`}
          >
            <ListItemAvatar>
              <Avatar>
                <LocationIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={location.name}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

LocationsGadgetList.propTypes = {
  locations: LocationsType.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default LocationsGadgetList;
