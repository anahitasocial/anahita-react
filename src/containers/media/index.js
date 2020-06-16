import React, { useEffect, useState } from 'react';
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
  }, []);

  const MediaBrowse = Browse(namespace);

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
          <Tab label="Updated" value={UPDATED} />
          <Tab label="Recent" value={RECENT} />
        </Tabs>
      </AppBar>
      <MediaBrowse
        key={`media-sort-${tab}`}
        queryFilters={{
          ...queryFilters,
          sort: tab,
        }}
      />
    </React.Fragment>
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
  selectedTab: UPDATED,
  queryFilters: {
    q: '',
    oid: 0,
    sort: UPDATED,
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
