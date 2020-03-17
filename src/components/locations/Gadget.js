import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import AnahitaMap from '../../components/Map';
import LocationsType from '../../proptypes/Locations';

const styles = (theme) => {
  return {
    root: {
      marginBottom: theme.spacing(2),
    },
    mapContainer: {
      height: 320,
      width: '100%',
    },
  };
};

const LocationsGadget = (props) => {
  const { locations, classes } = props;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (locations.allIds.length === 0) {
    return (<React.Fragment />);
  }

  const locationsArray = _.map(locations.byId, (value) => { return value; });

  return (
    <Card className={classes.root}>
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
      <AnahitaMap
        locations={locationsArray}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<Box style={{ height: '100%' }} />}
        containerElement={<Box className={classes.mapContainer} />}
        mapElement={<Box style={{ height: '100%' }} />}
      />
    </Card>
  );
};

LocationsGadget.propTypes = {
  classes: PropTypes.object.isRequired,
  locations: LocationsType.isRequired,
};

export default withStyles(styles)(LocationsGadget);
