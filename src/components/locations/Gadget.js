import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import GadgetList from './gadget/List';
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
  const {
    locations,
    canDelete,
    canAdd,
    handleDelete,
    handleOpen,
    classes,
  } = props;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (locations.allIds.length === 0 && !canAdd) {
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
      {locationsArray.length > 0 &&
      <React.Fragment>
        <AnahitaMap
          locations={locationsArray}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<Box style={{ height: '100%' }} />}
          containerElement={<Box className={classes.mapContainer} />}
          mapElement={<Box style={{ height: '100%' }} />}
        />
        <GadgetList
          locations={locations}
          handleDelete={handleDelete}
          canDelete={canDelete}
        />
      </React.Fragment>
      }
      {canAdd &&
        <CardActions>
          <Button
            onClick={handleOpen}
            variant="outlined"
            fullWidth
          >
            <AddIcon />
          </Button>
        </CardActions>
      }
    </Card>
  );
};

LocationsGadget.propTypes = {
  classes: PropTypes.object.isRequired,
  locations: LocationsType.isRequired,
  canDelete: PropTypes.bool.isRequired,
  canAdd: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

export default withStyles(styles)(LocationsGadget);
