import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  LoadScript,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';
import i18n from '../languages';
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

const AnahitaMap = (props) => {
  const {
    locations,
    width,
    height,
    ...other
  } = props;

  const [map, setMap] = useState(null);
  const history = useHistory();

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
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      language={i18n.language}
    >
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
                history.push(getURL(location));
              }}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
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

AnahitaMap.defaultProps = {
  locations: [],
  width: '100%',
  height: 400,
};

export default AnahitaMap;
