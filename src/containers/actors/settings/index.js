import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActorSettingCard from '../../../components/cards/ActorSetting';
import Apps from './apps/Browse';
import Delete from './Delete';
import Info from './Info';
import PermissionsBrowse from './permissions/Browse';
import PersonAccount from '../../people/settings/Account';
import PersonInfo from '../../people/settings/Info';
import Privacy from './Privacy';
import Progress from '../../../components/Progress';
import SimpleSnackbar from '../../../components/SimpleSnackbar';

import * as actions from '../../../actions';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import i18n from '../../../languages';

const TABS = {
  INFO: 'info',
  ACCOUNT: 'account',
  APPS: 'apps',
  PERMISSIONS: 'permissions',
  PRIVACY: 'privacy',
  DELETE: 'delete',
};

const ActorsSettings = (props) => {
  const {
    readActor,
    actor,
    resetActors,
    namespace,
    computedMatch: {
      params,
    },
    isFetching,
    error,
    success,
  } = props;

  const [id] = params.id.split('-');

  const [tab, setTab] = useState(TABS.INFO);

  useEffect(() => {
    readActor(id, namespace);

    return () => {
      resetActors();
    };
  }, []);

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

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
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Saved Successfully!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

ActorsSettings.propTypes = {
  readActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  resetActors: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
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
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettings);
};
