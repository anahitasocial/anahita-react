import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import api from '../../api';
import permissions from '../../permissions/node';
import NodeType from '../../proptypes/Node';
import PersonType from '../../proptypes/Person';

import AnahitaMap from '../../components/Map';
import Selector from './Selector';
// import Progress from '../../components/Progress';
import ListItem from './ListItem';
import DeleteAction from '../actions/tags/location/Delete';

const useStyles = makeStyles((theme) => {
  return {
    mapContainer: {
      height: theme.spacing(40),
      width: '100%',
    },
  };
});

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

const LocationsGadget = (props) => {
  const classes = useStyles();
  const {
    node,
    viewer,
    cardProps,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setWaiting(true);
    api.locations.browse({
      source_id: node.id,
      start: 0,
      limit: 20,
    })
      .then((response) => {
        const { data } = response.data;
        setLocations(data || []);
        setWaiting(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [node.id]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const canDelete = permissions.canEdit(viewer, node);
  const canAdd = permissions.canAdd(viewer, node);

  // if (locations.length === 0 && waiting) {
  //   return (
  //     <Progress />
  //   );
  // }

  return (
    <>
      {canAdd &&
        <Selector
          node={node}
          isOpen={isOpen}
          handleClose={handleClose}
          cardProps={cardProps}
          selectedLocations={locations}
        />}
      <Card {...cardProps}>
        <CardHeader
          title={
            <Typography
              variant="h3"
              style={{
                fontSize: 24,
              }}
            >
              Locations
            </Typography>
          }
        />
        {locations.length !== 0 &&
          <AnahitaMap
            locations={locations}
            googleMapURL={GOOGLE_MAP_URL}
            loadingElement={<Box style={{ height: '100%' }} />}
            containerElement={<Box className={classes.mapContainer} />}
            mapElement={<Box style={{ height: '100%' }} />}
          />}
        <List>
          {locations.map((location) => {
            return (
              <ListItem
                key={`location-graph-list-item-${location.id}`}
                location={location}
                actions={canDelete && <DeleteAction tag={location} node={node} />}
              />
            );
          })}
        </List>
        {canAdd &&
          <CardActions>
            <Button
              onClick={() => {
                return setIsOpen(true);
              }}
              variant="outlined"
              fullWidth
            >
              <AddIcon />
            </Button>
          </CardActions>}
      </Card>
    </>
  );
};

LocationsGadget.propTypes = {
  node: NodeType.isRequired,
  viewer: PersonType.isRequired,
  cardProps: PropTypes.objectOf(PropTypes.any),
};

LocationsGadget.defaultProps = {
  cardProps: {},
};

export default LocationsGadget;
