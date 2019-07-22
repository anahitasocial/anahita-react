import React from 'react';
import PropTypes from 'prop-types';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import i18n from '../languages';
import LocationType from '../proptypes/Location';

const AnahitaMap = (props) => {
  const {
    defaultCenter,
    locations,
    defaultZoom,
  } = props;

  return (
    <GoogleMap
      bootstrapURLKeys={{
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        language: i18n.language,
      }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
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
          />
        );
      })}
    </GoogleMap>
  );
};

AnahitaMap.propTypes = {
  defaultCenter: PropTypes.shape({
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
  }),
  locations: PropTypes.arrayOf(LocationType),
  defaultZoom: PropTypes.number,
};

AnahitaMap.defaultProps = {
  defaultZoom: 18,
  locations: [],
  defaultCenter: {
    lng: 0,
    lat: 0,
  },
};

export default withScriptjs(withGoogleMap(AnahitaMap));
