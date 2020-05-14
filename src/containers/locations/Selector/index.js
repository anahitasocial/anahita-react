import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { geolocated } from 'react-geolocated';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';

import NodeType from '../../../proptypes/Node';
import Browse from './Browse';

const LocationsSelector = (props) => {
  const {
    node,
    isOpen,
    handleClose,
    handleAddLocationTag,
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
        <DialogTitle id="locations-dialog-title">
          Locations
        </DialogTitle>
        {isOpen &&
          <Browse
            node={node}
            queryFilters={{
              q: keywordQuery,
              nearby_latitude: here.latitude,
              nearby_longitude: here.longitude,
            }}
            handleAddLocationTag={handleAddLocationTag}
            handleClose={handleClose}
          />
        }
      </Dialog>
    </React.Fragment>
  );
};

LocationsSelector.propTypes = {
  node: NodeType.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleAddLocationTag: PropTypes.func.isRequired,
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
