import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import LocationIcon from '@material-ui/icons/LocationOn';

import AnahitaMap from '../../components/Map';
import Progress from '../../components/Progress';
import api from '../../api';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeLocationsMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api.locations.browse({
      start: 0,
      limit: 100,
      sort: 'top',
    })
      .then((results) => {
        const { data } = results;
        setLocations([...data.data]);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar>
            <LocationIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6">
            Locations Map
          </Typography>
        }
      />
      {locations.length === 0 &&
        <Progress />
      }
      {locations.length > 0 &&
        <AnahitaMap
          locations={locations}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
      }
      <CardActions>
        <Button
          fullWidth
          href="/explore/locations/"
          various="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

export default HomeLocationsMap;
