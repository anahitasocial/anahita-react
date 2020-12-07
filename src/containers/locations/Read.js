import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import LocationIcon from '@material-ui/icons/LocationOn';

import * as actions from '../../actions';
import i18n from '../../languages';
import utils from '../../utils';

import LocationsType from '../../proptypes/Locations';

import AnahitaMap from '../../components/Map';
import Taggables from '../taggables';
import Progress from '../../components/Progress';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const useStyles = makeStyles({
  mapContainer: {
    height: 320,
    width: '100%',
  },
});

const { getAddress } = utils.node;

const LocationsRead = (props) => {
  const classes = useStyles();
  const {
    readItem,
    setAppTitle,
    items: {
      current: location,
    },
    taggablesCount,
    isFetching,
    error,
    match: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    readItem(id);
    setAppTitle(i18n.t('locations:cTitle'));
  }, []);

  if (isFetching) {
    return (
      <Progress key="location-progress" />
    );
  }

  if (error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

  return (
    <React.Fragment>
      <Card square variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <LocationIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {location.name}
            </Typography>
          }
          subheader={i18n.t('taggables:count', {
            count: taggablesCount,
          })}
        />
        {location.id &&
          <AnahitaMap
            locations={[location]}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div className={classes.mapContainer} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
        }
        <CardContent>
          <Typography variant="caption">
            {getAddress(location)}
          </Typography>
        </CardContent>
      </Card>
      <Taggables tag={location} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    locations: items,
    error,
    isFetching,
  } = state.locations;

  const {
    total,
  } = state.taggables;

  const taggablesCount = total;

  return {
    items,
    taggablesCount,
    error,
    isFetching,
  };
};

LocationsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readItem: PropTypes.func.isRequired,
  items: LocationsType.isRequired,
  match: PropTypes.object.isRequired,
  taggablesCount: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readItem: (id) => {
      return dispatch(actions.locations.read(id));
    },
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(LocationsRead));
