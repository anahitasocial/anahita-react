import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SearchBrowse from './Browse';
import { app as appActions } from '../../actions';
import {
  App as APP,
  Search as SEARCH,
} from '../../constants';
import i18n from '../../languages';

const { SORTING } = APP.BROWSE;

const { SCOPE } = SEARCH;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const Search = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    location: {
      search,
    },
  } = props;

  const { q } = queryString.parse(search);

  const [scope, setScope] = useState(SCOPE.ALL);
  const [sort, setSort] = useState(SORTING.RELEVANT);

  const changeScope = (event, value) => {
    setScope(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t('search:cTitle'));
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
          value={scope}
          onChange={changeScope}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" value={SCOPE.ALL} />
          <Tab label="Notes" value={SCOPE.POSTS.NOTES} />
          <Tab label="Photos" value={SCOPE.POSTS.PHOTOS} />
          <Tab label="Articles" value={SCOPE.POSTS.ARTICLES} />
          <Tab label="Topics" value={SCOPE.POSTS.TOPICS} />
          <Tab label="Todos" value={SCOPE.POSTS.TODOS} />
          <Tab label="People" value={SCOPE.ACTORS.PEOPLE} />
          <Tab label="Groups" value={SCOPE.ACTORS.GROUPS} />
        </Tabs>
      </AppBar>
      <SearchBrowse
        key={`${sort}-${scope}`}
        queryParams={{
          q,
          sort,
          scope,
        }}
      />
    </React.Fragment>
  );
};

Search.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
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
)(Search);
