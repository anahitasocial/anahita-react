import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { geolocated } from 'react-geolocated';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import LocationIcon from '@material-ui/icons/LocationOn';
import DeleteIcon from '@material-ui/icons/Clear';

import NodeType from '../../../proptypes/Node';
import Browse from './Browse';

const LocationsSelector = (props) => {
  const {
    node,
    isOpen,
    handleClose,
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = props;

  const here = {
    longitude: 0,
    latitude: 0,
  };

  if (
    isGeolocationAvailable &&
    isGeolocationEnabled &&
    coords
  ) {
    here.longitude = coords.longitude;
    here.latitude = coords.latitude;
  }

  const [keywordQuery, setKeywordQuery] = useState('');

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullScreen
      >
        <Card square>
          <CardHeader
            avatar={
              <Avatar>
                <LocationIcon />
              </Avatar>
            }
            title={
              <Typography variant="h6">
                Locations
              </Typography>
            }
            action={
              <IconButton
                aria-label="close"
                onClick={handleClose}
              >
                <DeleteIcon />
              </IconButton>
            }
          />
          <Divider light />
          {isOpen &&
            <Browse
              node={node}
              queryFilters={{
                q: keywordQuery,
                nearby_latitude: here.latitude,
                nearby_longitude: here.longitude,
              }}
              handleClose={handleClose}
            />
          }
        </Card>
      </Dialog>
    </React.Fragment>
  );
};

LocationsSelector.propTypes = {
  node: NodeType.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  coords: PropTypes.objectOf(PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
  })),
  isGeolocationAvailable: PropTypes.bool.isRequired,
  isGeolocationEnabled: PropTypes.bool.isRequired,
};

LocationsSelector.defaultProps = {
  coords: {
    longitude: 0.0,
    latitude: 0.0,
  },
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocationsSelector);
