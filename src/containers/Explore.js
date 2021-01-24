import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Helmet } from 'react-helmet';

import appActions from '../actions/app';
import i18n from '../languages';
import { App as APP } from '../constants';

import ActorsBrowse from './actors/Browse';
import Hashtags from './hashtags';
import Locations from './locations';
import Media from './media';

const TABS = {
  DOCUMENTS: 'documents',
  HASHTAGS: 'hashtags',
  LOCATIONS: 'locations',
  NOTES: 'notes',
  PEOPLE: 'people',
  PHOTOS: 'photos',
  GROUPS: 'groups',
};

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
  } = props;

  const [tab, setTab] = useState(TABS.GROUPS);

  const changeTab = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t('explore:cTitle'));
  });

  let NodeBrowse = null;

  switch (tab) {
    case TABS.PEOPLE:
    case TABS.GROUPS:
      NodeBrowse = ActorsBrowse(tab);
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
    <React.Fragment>
      <Helmet>
        <title>{i18n.t('dashboard:cTitle')}</title>
      </Helmet>
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
        >
          <Tab label="Groups" value={TABS.GROUPS} />
          <Tab label="People" value={TABS.PEOPLE} />
          <Tab label="Hashtags" value={TABS.HASHTAGS} />
          <Tab label="Locations" value={TABS.LOCATIONS} />
          <Tab label="Documents" value={TABS.DOCUMENTS} />
          <Tab label="Notes" value={TABS.NOTES} />
          <Tab label="Photos" value={TABS.PHOTOS} />
        </Tabs>
      </AppBar>
      {[
        TABS.PHOTOS,
        TABS.DOCUMENTS,
        TABS.LOCATIONS,
        TABS.NOTES,
        TABS.HASHTAGS,
      ].includes(tab) &&
        <NodeBrowse
          key={`sort-${tab}`}
          queryFilters={{
            oid: null,
            sort: RECENT,
          }}
        />
      }
      {[TABS.PEOPLE, TABS.GROUPS].includes(tab) &&
        <NodeBrowse
          key={`${tab}-sort-${tab}`}
        />
      }
    </React.Fragment>
  );
};

ExplorePage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
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
