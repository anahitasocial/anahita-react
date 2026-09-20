import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HashtagsIcon from '@material-ui/icons/Label';

import HashtagsBrowse from './Browse';
import BrowseHeader from '../../components/BrowseHeader';
import { App as APP } from '../../constants';
import i18n from '../../languages';

const {
  SORTING: {
    TRENDING,
    TOP,
    RECENT,
  },
} = APP.BROWSE;

const SORT_OPTIONS = [TRENDING, TOP, RECENT];

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const Hashtags = ({
  selectedTab = TRENDING,
}) => {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the only source of truth for the selected sort, so it is
  // shareable and works with the back button. Navigating also scrolls the page
  // back to the top, which keeps the freshly mounted list from immediately
  // paginating from a deep scroll position.
  const requested = searchParams.get('sort') || selectedTab;
  const tab = SORT_OPTIONS.includes(requested) ? requested : selectedTab;

  const changeTab = (event, value) => {
    const params = new URLSearchParams(searchParams);

    if (value === selectedTab) {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }

    setSearchParams(params);
  };

  return (
    <>
      {/* No action. A hashtag is not created here — it comes into being when
          somebody uses it in a post — so there is nothing for a + to open. */}
      <Box mb={2}>
        <BrowseHeader
          icon={<HashtagsIcon />}
          title={i18n.t('hashtags:cTitle')}
        />
      </Box>
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
  selectedTab: PropTypes.oneOf([
    TRENDING,
    TOP,
    RECENT,
  ]),
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
)(Hashtags);
