import React, { useEffect, useState, useMemo } from 'react';
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
  }, [setAppTitle]);

  return (
    <>
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
      {useMemo(() => {
        return (
          <LocationsBrowse
            key={`items-sort-${tab}`}
            queryFilters={{
              q: '',
              sort: tab,
            }}
          />
        );
      }, [tab])}
    </>
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
  selectedTab: TOP,
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
