import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import LocationIcon from '@material-ui/icons/LocationOn';

import LocationType from '../../../proptypes/Location';
import NodeType from '../../../proptypes/Node';
import AddAction from '../../actions/tags/location/Add';

const LocationsSelectorListItem = (props) => {
  const {
    canAdd,
    location,
    node,
  } = props;

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
        {canAdd && <AddAction node={node} tag={location} />}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

LocationsSelectorListItem.propTypes = {
  location: LocationType.isRequired,
  node: NodeType.isRequired,
  canAdd: PropTypes.bool.isRequired,
};

export default LocationsSelectorListItem;
