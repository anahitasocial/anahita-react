import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import LocationIcon from '@material-ui/icons/LocationOn';

import appActions from '../../actions/app';
import { locations as actions } from '../../actions';
import i18n from '../../languages';
import locationUtils from './utils';

import LocationsType from '../../proptypes/Locations';
import LocationDefault from '../../proptypes/LocationDefault';

import AnahitaMap from '../../components/Map';
import TaggablesBrowse from '../taggables/Browse';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const { TOP, RECENT } = APP.BROWSE.SORTING;
const TABS = [TOP, RECENT];
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const styles = {
  card: {
    marginBottom: 8 * 2,
  },
  pin: {
    fontSize: 48,
  },
  mapContainer: {
    height: 320,
    width: '100%',
  },
};

const LocationsRead = (props) => {
  const {
    readLocation,
    setAppTitle,
    locations,
    taggablesCount,
    isFetching,
    error,
    match: {
      params: {
        id,
      },
    },
  } = props;

  const [selectedTab, setSelectedTab] = useState(0);
  const [sort, setSort] = useState(TOP);

  const changeTab = (event, value) => {
    setSelectedTab(value);
    setSort(TABS[value]);
  };

  useEffect(() => {
    readLocation(id);
    setAppTitle(i18n.t('locations:cTitle'));
  }, []);

  const location = locations.current || { ...LocationDefault };

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (isFetching) {
    return (
      <Progress key="location-progress" />
    );
  }

  return (
    <React.Fragment>
      <Card
        square
        style={styles.card}
      >
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
        <Divider light />
        <AnahitaMap
          locations={[location]}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={styles.mapContainer} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
        <Divider light />
        <CardContent>
          <Typography variant="caption">
            {locationUtils.getAddress(location)}
          </Typography>
        </CardContent>
        <Divider light />
        <Tabs
          value={selectedTab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Top" />
          <Tab label="Recent" />
        </Tabs>
      </Card>
      {location.id && selectedTab === 0 &&
        <TaggablesBrowse tag={location} sorting={sort} />
      }
      {location.id && selectedTab === 1 &&
        <TaggablesBrowse tag={location} sorting={sort} />
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    locations,
    error,
    isFetching,
  } = state.locations;

  const {
    total,
  } = state.taggables;

  const taggablesCount = total;

  return {
    locations,
    taggablesCount,
    error,
    isFetching,
  };
};

LocationsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readLocation: PropTypes.func.isRequired,
  locations: LocationsType.isRequired,
  match: PropTypes.object.isRequired,
  taggablesCount: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readLocation: (id) => {
      return dispatch(actions.read(id));
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(LocationsRead));
