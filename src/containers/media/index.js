import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Browse from './Browse';
import actions from '../../actions/app';
import { App as APP } from '../../constants';
import i18n from '../../languages';

const {
  SORTING: {
    UPDATED,
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

const Media = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    selectedTab,
    namespace,
    queryFilters,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, [namespace]);

  const MediaBrowse = Browse(namespace);

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
          <Tab label={i18n.t('commons:sortByOptions.updated')} value={UPDATED} />
          <Tab label={i18n.t('commons:sortByOptions.recent')} value={RECENT} />
        </Tabs>
      </AppBar>
      {useMemo(() => {
        return (<MediaBrowse
          key={`media-tab-${tab}`}
          queryFilters={{
            ...queryFilters,
            sort: tab,
          }}
        />);
      }, [tab, queryFilters.oid, queryFilters.q, queryFilters.sort])}
    </>
  );
};

Media.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf([
    UPDATED,
    RECENT,
  ]),
  namespace: PropTypes.string.isRequired,
  queryFilters: PropTypes.object,
};

Media.defaultProps = {
  selectedTab: RECENT,
  queryFilters: {
    q: '',
    oid: 0,
    sort: RECENT,
  },
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      setAppTitle: (title) => {
        return dispatch(actions.setAppTitle(title));
      },
    };
  };
};

const mapStateToProps = (namespace) => {
  return () => {
    return {
      namespace,
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(),
  )(Media);
};
