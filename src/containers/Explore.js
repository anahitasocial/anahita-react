import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import appActions from '../actions/app';
import i18n from '../languages';
import { App as APP } from '../constants';

import Actors from './actors';
import People from './people';
import Hashtags from './hashtags';
import Locations from './locations';
import Media from './media';
import HeaderMeta from '../components/HeaderMeta';

const { EXPLORE: TABS } = APP.TABS;

const {
  SORTING: {
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

const ExplorePage = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    match: {
      params: {
        tab: selectedTab = TABS.GROUPS,
      },
    },
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t('explore:cTitle'));
  });

  let NodeBrowse = null;

  switch (tab) {
    case TABS.GROUPS:
      NodeBrowse = Actors(tab);
      break;
    case TABS.HASHTAGS:
      NodeBrowse = Hashtags;
      break;
    case TABS.LOCATIONS:
      NodeBrowse = Locations;
      break;
    case TABS.MEDIA:
    default:
      NodeBrowse = Media(tab);
  }

  return (
    <>
      <HeaderMeta title={i18n.t('explore:cTitle')} />
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        elevation={1}
      >
        <Tabs
          value={tab}
          onChange={changeTab}
          variant="scrollable"
        >
          {Object.keys({ ...TABS }).map((t) => {
            const value = TABS[t];
            const label = i18n.t(`explore:tabs.${value}`);
            const key = `explore-tab-${value}`;

            return (
              <Tab label={label} value={value} key={key} />
            );
          })}
        </Tabs>
      </AppBar>
      {[
        TABS.ARTICLES,
        TABS.DOCUMENTS,
        TABS.HASHTAGS,
        TABS.PHOTOS,
        TABS.LOCATIONS,
        TABS.NOTES,
        TABS.TODOS,
        TABS.TOPICS,
      ].includes(tab) &&
        <NodeBrowse
          key={`sort-${tab}`}
          queryFilters={{
            oid: null,
            sort: RECENT,
          }}
        />}
      {tab === TABS.PEOPLE &&
        <People key={`${tab}-tab`} />}
      {[TABS.GROUPS].includes(tab) &&
        <NodeBrowse
          key={`${tab}-sort-${tab}`}
        />}
    </>
  );
};

ExplorePage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExplorePage);
