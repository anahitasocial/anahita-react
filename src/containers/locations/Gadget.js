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

import actions from '../../actions';
import permissions from '../../permissions/node';
import LocationType from '../../proptypes/Location';
import NodeType from '../../proptypes/Node';
import PersonType from '../../proptypes/Person';

import AnahitaMap from '../../components/Map';
import Selector from './Selector';
import Progress from '../../components/Progress';
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

const LocationsGadget = (props) => {
  const classes = useStyles();
  const {
    node,
    viewer,
    locationsGraph,
    isFetching,
    error,
    browse,
    cardProps,
  } = props;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const [isOpen, setIsOpen] = useState(false);

  const locations = locationsGraph[node.id] || {
    allIds: [],
    byId: {},
  };

  useEffect(() => {
    browse(node, {
      objectType: 'com.locations.location',
      taggable_id: node.id,
      offset: 0,
    });
  }, [browse, node]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (locations.byId.length === 0 && isFetching[node.id]) {
    return (
      <Progress />
    );
  }

  if (error[node.id]) {
    return (
      <Typography
        variant="body1"
        color="error"
        align="center"
        gutterBottom
      >
        {error[node.id]}
      </Typography>
    );
  }

  const canDelete = permissions.canEdit(viewer, node);
  const canAdd = permissions.canAdd(viewer, node);
  const locationsArray = _.map(locations.byId, (value) => { return value; });

  return (
    <>
      {canAdd &&
        <Selector
          node={node}
          isOpen={isOpen}
          handleClose={handleClose}
          cardProps={cardProps}
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
        {locationsArray.length > 0 &&
          <AnahitaMap
            locations={locationsArray}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<Box style={{ height: '100%' }} />}
            containerElement={<Box className={classes.mapContainer} />}
            mapElement={<Box style={{ height: '100%' }} />}
          />}
        <List>
          {locations.allIds.map((locationId) => {
            const location = locations.byId[locationId];
            return (
              <ListItem
                key={`location-graph-list-item-${locationId}`}
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
  locationsGraph: PropTypes.objectOf(LocationType).isRequired,
  browse: PropTypes.func.isRequired,
  isFetching: PropTypes.objectOf(PropTypes.bool).isRequired,
  error: PropTypes.objectOf(PropTypes.string).isRequired,
  cardProps: PropTypes.objectOf(PropTypes.any),
};

LocationsGadget.defaultProps = {
  cardProps: {},
};

const mapStateToProps = (state) => {
  const {
    locations: locationsGraph,
    error,
    isFetching,
  } = state.locationsGraph;

  const {
    viewer,
  } = state.session;

  return {
    locationsGraph,
    error,
    isFetching,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browse: (node, params) => {
      return dispatch(actions.locationsGraph.browse(node)(params));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsGadget);
