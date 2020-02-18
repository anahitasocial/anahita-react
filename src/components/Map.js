import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import i18n from '../languages';
import LocationType from '../proptypes/Location';
import { getURL } from './utils';

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
    ...other
  } = props;

  const bounds = getBounds(locations);
  const history = useHistory();

  return (
    <GoogleMap
      bootstrapURLKeys={{
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        language: i18n.language,
      }}
      ref={(map) => {
        return map && map.fitBounds(bounds);
      }}
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
  );
};

AnahitaMap.propTypes = {
  locations: PropTypes.arrayOf(LocationType),
};

AnahitaMap.defaultProps = {
  locations: [],
};

export default withScriptjs(withGoogleMap(AnahitaMap));
