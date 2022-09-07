import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import LocationIcon from '@material-ui/icons/LocationOn';

import utils from '../../utils';
import LocationType from '../../proptypes/Location';

const { getAddress } = utils.node;

const LocationsListItem = (props) => {
  const {
    location,
    actions,
  } = props;

  return (
    <ListItem
      key={`locations-list-item-${location.id}`}
      button
      component="a"
      href={`/locations/${location.id}-${location.alias}/`}
      divider
    >
      <ListItemAvatar>
        <Avatar>
          <LocationIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={location.name}
        secondary={getAddress(location)}
      />
      {actions &&
      <ListItemSecondaryAction>
        {actions}
      </ListItemSecondaryAction>}
    </ListItem>
  );
};

LocationsListItem.propTypes = {
  location: LocationType.isRequired,
  actions: PropTypes.node,
};

LocationsListItem.defaultProps = {
  actions: null,
};

export default LocationsListItem;
