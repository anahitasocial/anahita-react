import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  Marker,
} from '@react-google-maps/api';
import LocationType from '../proptypes/Location';
import utils from '../utils';

const { getURL } = utils.node;

const center = {
  lat: -3.745,
  lng: -38.523,
};

const getBounds = (locations) => {
  const { maps } = window.google;
  const bounds = new maps.LatLngBounds();

  locations.forEach((loc) => {
    const latLng = new maps.LatLng(loc.latitude, loc.longitude);
    bounds.extend(latLng);
  });

  return bounds;
};

const AnahitaMap = ({
  locations = [],
  width = '100%',
  height = 400,
  ...other
}) => {
  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null);
  const navigate = useNavigate();

  const onLoad = useCallback((newMap) => {
    const bounds = getBounds(locations);
    newMap.fitBounds(bounds);

    const { maps } = window.google;
    const listener = maps.event.addListener(newMap, 'idle', () => {
      if (newMap.getZoom() > 16) {
        newMap.setZoom(16);
      }

      maps.event.removeListener(listener);
    });

    setMap(newMap);
  }, [locations]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={{
        width,
        height,
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
      center={center}
      {...other}
    >
      {locations.map((location) => {
        const key = `map-marker-${location.id}`;
        const { name, longitude, latitude } = location;
        return (
          <Marker
            key={key}
            position={{
              lng: longitude,
              lat: latitude,
            }}
            title={name}
            onClick={() => {
              navigate(getURL(location));
            }}
          />
        );
      })}
    </GoogleMap>
  );
};

AnahitaMap.propTypes = {
  locations: PropTypes.arrayOf(LocationType),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default AnahitaMap;
