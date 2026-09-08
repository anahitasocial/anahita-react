import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import LocationType from '../proptypes/Location';
import utils from '../utils';

const { getURL } = utils.node;

// Leaflet points its default marker at image paths relative to the stylesheet,
// which the bundler rewrites — hand it the imported assets instead.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const DEFAULT_CENTER = [-3.745, -38.523];
const DEFAULT_ZOOM = 13;

// A single location fits to a bounding box of zero size, which would zoom all
// the way in — cap it the way the Google map used to.
const MAX_FIT_ZOOM = 16;

const hasCoordinates = (location) => {
  return Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude));
};

const getPoints = (locations) => {
  return locations.filter(hasCoordinates).map((location) => {
    return [Number(location.latitude), Number(location.longitude)];
  });
};

const FitBounds = ({ locations }) => {
  const map = useMap();
  const points = getPoints(locations);

  // Depend on the coordinates by value: `locations` is a fresh array on every
  // render, and re-fitting on each one would fight the user's panning.
  const pointsKey = points.join('|');

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    map.fitBounds(L.latLngBounds(points), {
      maxZoom: MAX_FIT_ZOOM,
      padding: [24, 24],
    });
  }, [map, pointsKey]);

  return null;
};

FitBounds.propTypes = {
  locations: PropTypes.arrayOf(LocationType).isRequired,
};

const AnahitaMap = ({
  locations = [],
  width = '100%',
  height = 400,
  ...other
}) => {
  const navigate = useNavigate();

  return (
    <MapContainer
      style={{
        width,
        height,
      }}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      {...other}
    >
      <TileLayer
        url={TILE_URL}
        attribution={TILE_ATTRIBUTION}
      />
      <FitBounds locations={locations} />
      {locations.filter(hasCoordinates).map((location) => {
        const key = `map-marker-${location.id}`;
        const { name, longitude, latitude } = location;
        return (
          <Marker
            key={key}
            position={[Number(latitude), Number(longitude)]}
            title={name}
            alt={name}
            eventHandlers={{
              click: () => {
                navigate(getURL(location));
              },
            }}
          />
        );
      })}
    </MapContainer>
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
