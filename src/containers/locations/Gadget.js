import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import * as actions from '../../actions';
import permissions from '../../permissions/node';
import LocationsType from '../../proptypes/Locations';
import NodeType from '../../proptypes/Node';
import PersonType from '../../proptypes/Person';

import ListItem from './gadget/ListItem';
import AnahitaMap from '../../components/Map';
import Selector from './Selector';
import Progress from '../../components/Progress';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginBottom: theme.spacing(2),
    },
    mapContainer: {
      height: 320,
      width: '100%',
    },
  };
});

const LocationsGadget = (props) => {
  const classes = useStyles();
  const {
    node,
    viewer,
    locations,
    isFetching,
    error,
    browse,
    reset,
  } = props;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    browse(node, {
      objectType: 'com.locations.location',
      taggable_id: node.id,
      offset: 0,
    });

    return () => {
      reset(node);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (locations.byId.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  const canDelete = permissions.canEdit(viewer, node);
  const canAdd = permissions.canAdd(viewer, node);
  const locationsArray = _.map(locations.byId, (value) => { return value; });

  return (
    <React.Fragment>
      <Selector
        node={node}
        isOpen={isOpen}
        handleClose={handleClose}
      />
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
          <AnahitaMap
            locations={locationsArray}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<Box style={{ height: '100%' }} />}
            containerElement={<Box className={classes.mapContainer} />}
            mapElement={<Box style={{ height: '100%' }} />}
          />
        }
        <List>
          {locations.allIds.map((locationId) => {
            const location = locations.byId[locationId];
            return (
              <ListItem
                key={`location-graph-list-item-${locationId}`}
                location={location}
                node={node}
                canDelete={canDelete}
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
          </CardActions>
        }
      </Card>
    </React.Fragment>
  );
};

LocationsGadget.propTypes = {
  node: NodeType.isRequired,
  viewer: PersonType.isRequired,
  locations: LocationsType.isRequired,
  browse: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    locationsGraph: locations,
    error,
    isFetching,
  } = state.locationsGraph;

  const {
    viewer,
  } = state.session;

  return {
    locations,
    error,
    isFetching,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browse: (node, params) => {
      return dispatch(actions.locationsGraph(node).browse(params));
    },
    reset: (node) => {
      return dispatch(actions.locationsGraph(node).reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsGadget);
