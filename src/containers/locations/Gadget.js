import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import * as actions from '../../actions';
import permissions from '../../permissions/node';
import LocationsType from '../../proptypes/Locations';
import NodeType from '../../proptypes/Node';
import PersonType from '../../proptypes/Person';

import Gadget from '../../components/locations/Gadget';
import Progress from '../../components/Progress';

const LocationsGadget = (props) => {
  const {
    node,
    viewer,
    locations,
    isFetching,
    error,
    browse,
    deleteItem,
    reset,
  } = props;

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

  const handleDelete = (location) => {
    return deleteItem(node, location);
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

  return (
    <Gadget
      locations={locations}
      handleDelete={handleDelete}
      canDelete={canDelete}
    />
  );
};

LocationsGadget.propTypes = {
  node: NodeType.isRequired,
  viewer: PersonType.isRequired,
  locations: LocationsType.isRequired,
  browse: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
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
    deleteItem: (node, location) => {
      return dispatch(actions.locationsGraph(node).deleteItem(location));
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
