import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HashtagsBrowse from './Browse';
import actions from '../../actions';
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

const Hashtags = (props) => {
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
    setAppTitle(i18n.t('hashtags:cTitle'));
  }, []);

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
          <Tab label={i18n.t('commons:sortByOptions.trending')} value={TRENDING} />
          <Tab label={i18n.t('commons:sortByOptions.top')} value={TOP} />
          <Tab label={i18n.t('commons:sortByOptions.recent')} value={RECENT} />
        </Tabs>
      </AppBar>
      {useMemo(() => {
        return (
          <HashtagsBrowse
            key={`items-tab-${tab}`}
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

Hashtags.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf([
    TRENDING,
    TOP,
    RECENT,
  ]),
};

Hashtags.defaultProps = {
  selectedTab: TRENDING,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hashtags);
