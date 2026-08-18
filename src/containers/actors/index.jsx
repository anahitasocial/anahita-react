import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Browse from './Browse';

import { Actor as ACTOR } from '../../constants';
import PersonType from '../../proptypes/Person';
import actions from '../../actions';
import i18n from '../../languages';

const { FILTER } = ACTOR;

// The "All" tab carries no filter, so it is represented by the absence of the
// query param rather than by an empty value.
const ALL = '';
const AUTH_FILTERS = [FILTER.FOLLOWING, FILTER.ADMINISTERING];

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const Actors = ({
  setAppTitle,
  selectedTab = ALL,
  namespace,
  owner,
  isAuthenticated,
}) => {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the only source of truth for the selected tab, so the tab is
  // shareable and works with the back button, and there is no local state that
  // can drift out of sync with it. Anything unrecognized — or an authenticated
  // filter while logged out — falls back to "All".
  const requested = searchParams.get('filter') || selectedTab;
  const tab = (isAuthenticated && AUTH_FILTERS.includes(requested)) ? requested : ALL;

  const changeTab = (event, value) => {
    const params = new URLSearchParams(searchParams);

    if (value === ALL) {
      params.delete('filter');
    } else {
      params.set('filter', value);
    }

    setSearchParams(params);
  };

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, []);

  const ActorsBrowse = Browse(namespace);

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
          <Tab label={i18n.t('commons:all')} value="" />
          {isAuthenticated && <Tab label={i18n.t('commons:following')} value={FILTER.FOLLOWING} />}
          {isAuthenticated && <Tab label={i18n.t('commons:administering')} value={FILTER.ADMINISTERING} />}
        </Tabs>
      </AppBar>
      {useMemo(() => {
        return (
          <ActorsBrowse
            key={`actors-tab-${tab}`}
            queryFilters={{
              oid: owner.id,
              filter: tab,
            }}
          />
        );
      }, [owner.id, tab])}
    </>
  );
};

Actors.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf([
    ALL,
    FILTER.ADMINISTERING,
    FILTER.FOLLOWING,
  ]),
  namespace: PropTypes.string.isRequired,
  owner: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      viewer: owner,
      isAuthenticated,
    } = state.session;

    return {
      namespace,
      owner,
      isAuthenticated,
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(),
  )(Actors);
};
