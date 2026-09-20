import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import GroupsIcon from '@material-ui/icons/GroupWork';
import PeopleIcon from '@material-ui/icons/People';

import Browse from './Browse';
import BrowseHeader from '../../components/BrowseHeader';

import { Actor as ACTOR } from '../../constants';
import permissions from '../../permissions';
import PersonType from '../../proptypes/Person';
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

// The avatar each namespace wears in its header, matching the left menu so the
// same thing is the same shape in both places.
const BROWSE_ICONS = {
  groups: <GroupsIcon />,
  people: <PeopleIcon />,
};

const Actors = ({
  selectedTab = ALL,
  namespace,
  owner,
  isAuthenticated,
  actorSettings = {},
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

  const ActorsBrowse = Browse(namespace);

  // Only /groups routes here today — /people has its own browse container —
  // so the add action is the group one. The icon and title come from the
  // namespace either way, so nothing here assumes which one arrived.
  //
  // Gated on GROUPS_FROM rather than on being signed in, which is all the
  // route itself requires. group-service enforces the same setting on the
  // write, so offering a + without asking would lead people to a form the
  // server refuses.
  const canAddGroup = namespace === 'groups'
    && permissions.actor.canAdd(owner, actorSettings);

  return (
    <>
      {/* Above the filters, not inside them: the header says what the page is,
          the tabs narrow it, and the tabs are the half worth pinning. */}
      <Box mb={2}>
        <BrowseHeader
          icon={BROWSE_ICONS[namespace]}
          title={i18n.t(`${namespace}:cTitle`)}
          actionTo={canAddGroup ? '/groups/add' : ''}
          actionLabel={i18n.t('groups:add.cTitle')}
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
  selectedTab: PropTypes.oneOf([
    ALL,
    FILTER.ADMINISTERING,
    FILTER.FOLLOWING,
  ]),
  namespace: PropTypes.string.isRequired,
  owner: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  actorSettings: PropTypes.object,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      viewer: owner,
      isAuthenticated,
    } = state.session;

    const { nodeInfo } = state.app;

    return {
      namespace,
      owner,
      isAuthenticated,
      // Empty until NodeInfo answers. An absent level ranks above every role,
      // so the + arrives with the document rather than flashing for somebody
      // who turns out not to qualify.
      actorSettings: (nodeInfo && nodeInfo.metadata) || {},
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
  )(Actors);
};
