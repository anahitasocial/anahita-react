import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BlogsBrowse from './Browse';
import { App as APP } from '../../constants';
import actions from '../../actions/app';
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

const Blogs = (props) => {
  const classes = useStyles();
  const {
    selectedTab,
    setAppTitle,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  useEffect(() => {
    setAppTitle(i18n.t('blogs:cTitle'));
  }, []);

  const changeTab = (event, value) => {
    setTab(value);
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        variant="outlined"
      >
        <Tabs
          value={tab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={i18n.t('commons:sortByOptions.recent')} value={RECENT} />
          <Tab label={i18n.t('commons:sortByOptions.updated')} value={UPDATED} />
        </Tabs>
      </AppBar>
      {useMemo(() => {
        return (<BlogsBrowse
          key={`blog-tab-${tab}`}
          queryFilters={{
            q: '',
            sort: tab,
          }}
        />);
      }, [tab])}
    </>
  );
};

Blogs.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf([
    UPDATED,
    RECENT,
  ]),
};

Blogs.defaultProps = {
  selectedTab: RECENT,
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

const mapStateToProps = () => {
  return () => {
    return {};
  };
};

export default connect(
  mapStateToProps(),
  mapDispatchToProps(),
)(Blogs);
