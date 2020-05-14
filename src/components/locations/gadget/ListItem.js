import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import DeleteIcon from '@material-ui/icons/Clear';
import LocationIcon from '@material-ui/icons/LocationOn';

import LocationType from '../../../proptypes/Location';

import locationUtils from '../../../containers/locations/utils';

const LocationsGadgetListItem = (props) => {
  const {
    location,
    handleDelete,
    canDelete,
  } = props;

  const [isWaiting, setIsWaiting] = useState(false);

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
        secondary={locationUtils.getAddress(location)}
      />
      {canDelete &&
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              setIsWaiting(true);
              handleDelete(location).then(() => {
                setIsWaiting(false);
              });
            }}
          >
            {!isWaiting && <DeleteIcon />}
            {isWaiting && <CircularProgress size={20} />}
          </IconButton>
        </ListItemSecondaryAction>
      }
    </ListItem>
  );
};

LocationsGadgetListItem.propTypes = {
  location: LocationType.isRequired,
  handleDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
};

export default LocationsGadgetListItem;
