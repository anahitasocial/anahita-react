import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActorSettingCard from '../../../components/cards/ActorSetting';

import Admins from './admins/Browse';
import Apps from './apps/Browse';
import Delete from './Delete';
import Info from './Info';
import PermissionsBrowse from './permissions/Browse';
import PersonAccount from '../../people/settings/Account';
import PersonInfo from '../../people/settings/Info';
import Privacy from './Privacy';
import Progress from '../../../components/Progress';

import * as actions from '../../../actions';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import i18n from '../../../languages';

const TABS = {
  ADMINS: 'admins',
  ACCOUNT: 'account',
  APPS: 'apps',
  INFO: 'info',
  PERMISSIONS: 'permissions',
  PRIVACY: 'privacy',
  DELETE: 'delete',
};

const ActorsSettings = (props) => {
  const {
    readActor,
    actor,
    resetActors,
    alertSuccess,
    alertError,
    namespace,
    selectedTab,
    computedMatch: {
      params,
    },
    isFetching,
    error,
    success,
  } = props;

  const [id] = params.id.split('-');

  const [tab, setTab] = useState(selectedTab);

  useEffect(() => {
    readActor(id, namespace);

    return () => {
      resetActors();
    };
  }, [id]);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Updated successfully!');
    }
  }, [error, success]);

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  const ActorAdmins = Admins(namespace);
  const ActorApps = Apps(namespace);
  const ActorInfo = Info(namespace);
  const ActorPermissionsBrowse = PermissionsBrowse(namespace);
  const ActorPrivacy = Privacy(namespace);
  const ActorDelete = Delete(namespace);

  const canDelete = permissions.canDelete(actor);

  return (
    <React.Fragment>
      <Tabs
        variant="scrollable"
        scrollButtons="on"
        value={tab}
        onChange={(e, newTab) => {
          setTab(newTab);
        }}
        aria-label="Actor Settings"
      >
        <Tab label="Info" value={TABS.INFO} />
        {namespace === 'people' &&
          <Tab label="Account" value={TABS.ACCOUNT} />
        }
        {namespace !== 'people' &&
          <Tab label="Admins" value={TABS.ADMINS} />
        }
        <Tab label="Privacy" value={TABS.PRIVACY} />
        <Tab label="Apps" value={TABS.APPS} />
        <Tab label="Permissions" value={TABS.PERMISSIONS} />
        {canDelete &&
          <Tab label="Delete" value={TABS.DELETE} />
        }
      </Tabs>
      <ActorSettingCard
        namespace={namespace}
        actor={actor}
        subheader={i18n.t(`${namespace}:settings.${tab}`)}
      >
        {namespace === 'people' && tab === TABS.INFO &&
          <PersonInfo />
        }
        {namespace !== 'people' && tab === TABS.INFO &&
          <ActorInfo />
        }
        {namespace === 'people' && tab === TABS.ACCOUNT &&
          <PersonAccount />
        }
        {namespace !== 'people' && tab === TABS.ADMINS &&
          <ActorAdmins />
        }
        {tab === TABS.PRIVACY &&
          <ActorPrivacy />
        }
        {tab === TABS.APPS &&
          <ActorApps />
        }
        {tab === TABS.PERMISSIONS &&
          <ActorPermissionsBrowse />
        }
        {canDelete && tab === TABS.DELETE &&
          <ActorDelete />
        }
      </ActorSettingCard>
    </React.Fragment>
  );
};

ActorsSettings.propTypes = {
  readActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  resetActors: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  selectedTab: PropTypes.oneOf([
    TABS.ADMINS,
    TABS.ACCOUNT,
    TABS.APPS,
    TABS.INFO,
    TABS.PERMISSIONS,
    TABS.PRIVACY,
    TABS.DELETE,
  ]),
};

ActorsSettings.defaultProps = {
  selectedTab: TABS.INFO,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
      isFetching,
      error,
      success,
    } = state[namespace];

    return {
      actor,
      namespace,
      isFetching,
      error,
      success,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readActor: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        return dispatch(actions[namespace].reset());
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettings);
};
