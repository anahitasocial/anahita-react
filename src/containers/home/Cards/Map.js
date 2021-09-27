/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';


import AnahitaMap from '../../../components/Map';
import Progress from '../../../components/Progress';
import api from '../../../api';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeCardMap = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.locations.browse({
      start: 0,
      limit: 100,
      sort: 'top',
    })
      .then((results) => {
        const { data } = results;
        setItems([...data.data]);
      })
      .catch((err) => {
        return console.error(err);
      });
  }, []);

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Typography variant="h6">
            Locations Map
          </Typography>
        }
        subheader="Tag Nodes"
      />
      {items.length === 0 &&
        <Progress />
      }
      {items.length > 0 &&
        <AnahitaMap
          locations={items}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          height={295}
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

export default HomeCardMap;
