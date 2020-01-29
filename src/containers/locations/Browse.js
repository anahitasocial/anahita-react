import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import InfiniteScroll from 'react-infinite-scroller';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import LocationIcon from '@material-ui/icons/LocationOn';

import Progress from '../../components/Progress';

import appActions from '../../actions/app';
import { locations as actions } from '../../actions';
import i18n from '../../languages';
import locationUtils from './utils';
import { App as APP } from '../../constants';

const {
  LIMIT,
  SORTING: {
    TRENDING,
    TOP,
    RECENT,
  },
} = APP.BROWSE;
const TABS = [TRENDING, TOP, RECENT];

const styles = {
  appBar: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
};

class LocationsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      locations: {
        byId: {},
        allIds: [],
      },
      sort: 'trending',
      error: '',
      hasMore: true,
      selectedTab: 0,
    };

    this.offset = 0;
    this.fetchList = this.fetchList.bind(this);
    this.changeTab = this.changeTab.bind(this);

    const { setAppTitle } = props;
    setAppTitle(i18n.t('locations:cTitle'));
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      locations,
      error,
      hasMore,
    } = nextProps;

    return {
      locations,
      error,
      hasMore,
    };
  }

  componentWillUnmount() {
    const { resetLocations } = this.props;
    resetLocations();
  }

  fetchList() {
    const { sort } = this.state;
    const { browseLocations } = this.props;

    browseLocations({
      sort,
      start: this.offset,
      limit: LIMIT,
    }).then(() => {
      this.offset += LIMIT;
    });
  }

  changeTab(event, value) {
    const { resetLocations } = this.props;

    this.offset = 0;
    resetLocations();

    this.setState({
      selectedTab: value,
      sort: TABS[value],
    });
  }

  render() {
    const {
      locations,
      error,
      hasMore,
      selectedTab,
    } = this.state;

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    return (
      <React.Fragment>
        <AppBar
          position="sticky"
          color="inherit"
          style={styles.appBar}
          elevation={1}
        >
          <Tabs
            value={selectedTab}
            onChange={this.changeTab}
            centered
            variant="fullWidth"
          >
            <Tab label="Trending" />
            <Tab label="Top" />
            <Tab label="Recent" />
          </Tabs>
        </AppBar>
        <List>
          <InfiniteScroll
            loadMore={this.fetchList}
            hasMore={hasMore}
            loader={
              <Progress key="locations-progress" />
            }
          >
            {locations.allIds.map((locationId) => {
              const location = locations.byId[locationId];
              return (
                <React.Fragment key={`location_list_item_container_${location.id}`}>
                  <ListItem
                    key={`location_list_item_${location.id}`}
                    href={`/locations/${location.id}-${location.alias}/`}
                    button
                    component="a"
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <LocationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={location.name}
                      secondary={locationUtils.getAddress(location)}
                    />
                  </ListItem>
                  <Divider
                    component="li"
                    light
                    key={`location_list_divider_${location.id}`}
                  />
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </List>
      </React.Fragment>
    );
  }
}

LocationsBrowse.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  browseLocations: PropTypes.func.isRequired,
  resetLocations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    locations,
    error,
    isFetching,
    hasMore,
  } = state.locations;

  return {
    locations,
    error,
    isFetching,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseLocations: (params) => {
      return dispatch(actions.browse(params));
    },
    resetLocations: () => {
      return dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsBrowse);
