import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Browse from './browse';

import { Actor as ACTOR } from '../../constants';
import PersonType from '../../proptypes/Person';
import actions from '../../actions';
import i18n from '../../languages';

const { FILTER } = ACTOR;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const Actors = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    selectedTab,
    namespace,
    owner,
    isAuthenticated,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
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
    '',
    FILTER.ADMINISTERING,
    FILTER.FOLLOWING,
  ]),
  namespace: PropTypes.string.isRequired,
  owner: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

Actors.defaultProps = {
  selectedTab: '',
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
