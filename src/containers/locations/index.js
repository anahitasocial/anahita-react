import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import LocationsBrowse from './Browse';
import appActions from '../../actions/app';
import { App as APP } from '../../constants';
import i18n from '../../languages';

const {
  SORTING: {
    TRENDING,
    TOP,
    RECENT,
  },
} = APP.BROWSE;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const LocationsPanel = (props) => {
  const { sort } = props;
  return (
    <LocationsBrowse
      queryFilters={{
        q: '',
        sort,
      }}
    />
  );
};

LocationsPanel.propTypes = {
  sort: PropTypes.oneOf([
    TRENDING,
    TOP,
    RECENT,
  ]).isRequired,
};

const Locations = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    selectedTab,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t('locations:cTitle'));
  }, []);

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        elevation={1}
      >
        <Tabs
          value={tab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Trending" value={TRENDING} />
          <Tab label="Top" value={TOP} />
          <Tab label="Recent" value={RECENT} />
        </Tabs>
      </AppBar>
      {tab === TRENDING &&
        <LocationsPanel sort={tab} />
      }
      {tab === TOP &&
        <LocationsPanel sort={tab} />
      }
      {tab === RECENT &&
        <LocationsPanel sort={tab} />
      }
    </React.Fragment>
  );
};

Locations.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf([
    TRENDING,
    TOP,
    RECENT,
  ]),
};

Locations.defaultProps = {
  selectedTab: RECENT,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Locations);
