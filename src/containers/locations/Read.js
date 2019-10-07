import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
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

const SORT_TOP = 'top';
const SROT_RECENT = 'recent';

const TABS = [SORT_TOP, SROT_RECENT];

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

class LocationsRead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: { ...LocationDefault },
      isFetching: false,
      error: '',
      sort: 'top',
      selectedTab: 0,
      taggablesCount: 0,
    };

    this.changeTab = this.changeTab.bind(this);

    const {
      readLocation,
      setAppTitle,
      match: {
        params: {
          id,
        },
      },
    } = props;

    readLocation(id);
    setAppTitle(i18n.t('locations:cTitle'));
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      locations,
      taggablesCount,
      isFetching,
      error,
    } = nextProps;

    return {
      location: locations.current,
      taggablesCount,
      isFetching,
      error,
    };
  }

  changeTab(event, value) {
    this.setState({
      selectedTab: value,
      sort: TABS[value],
    });
  }

  render() {
    const {
      location,
      taggablesCount,
      isFetching,
      error,
      selectedTab,
      sort,
    } = this.state;

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    if (isFetching) {
      return (
        <Grid
          container
          justify="center"
          alignItems="center"
          key="actors-progress"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
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
            defaultCenter={{
              lat: location.latitude,
              lng: location.longitude,
            }}
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
            onChange={this.changeTab}
            centered
            variant="fullWidth"
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
  }
}

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
  taggablesCount: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
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
