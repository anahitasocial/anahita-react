import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActorSettingCard from '../../../components/cards/ActorSetting';

import Admins from './admins/Browse';
import Features from './Features';
import Delete from './Delete';
import Info from './Info';
import PersonAccount from '../../people/settings/Account';
import PersonInfo from '../../people/settings/Info';
import Access from './Access';
import Progress from '../../../components/Progress';

import actions from '../../../actions';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import i18n from '../../../languages';

const TABS = {
  ADMINS: 'admins',
  ACCOUNT: 'account',
  FEATURES: 'features',
  INFO: 'info',
  ACCESS: 'access',
  DELETE: 'delete',
};

const ActorsSettings = (props) => {
  const {
    readActor,
    actor,
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
    if (id && !actor.id) {
      readActor(id, namespace);
    }
  }, []);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.sucess'));
    }
  }, [error, success]);

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  const ActorAdmins = Admins(namespace);
  const ActorFeatures = Features(namespace);
  const ActorInfo = Info(namespace);
  const ActorAccess = Access(namespace);
  const ActorDelete = Delete(namespace);

  const canDelete = permissions.canDelete(actor);

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="on"
        value={tab}
        onChange={(e, newTab) => {
          setTab(newTab);
        }}
        aria-label={i18n.t('commons:settings')}
      >
        <Tab label={i18n.t(`${namespace}:settings.info`)} value={TABS.INFO} />
        {namespace === 'people' &&
          <Tab label={i18n.t(`${namespace}:settings.account`)} value={TABS.ACCOUNT} />}
        {namespace !== 'people' &&
          <Tab label={i18n.t(`${namespace}:settings.admins`)} value={TABS.ADMINS} />}
        <Tab label={i18n.t(`${namespace}:settings.access`)} value={TABS.ACCESS} />
        <Tab label={i18n.t(`${namespace}:settings.features`)} value={TABS.FEATURES} />
        {canDelete &&
          <Tab label={i18n.t(`${namespace}:settings.delete`)} value={TABS.DELETE} />}
      </Tabs>
      <ActorSettingCard
        namespace={namespace}
        actor={actor}
        subheader={i18n.t(`${namespace}:settings.${tab}`)}
      >
        {namespace === 'people' && tab === TABS.INFO &&
          <PersonInfo />}
        {namespace !== 'people' && tab === TABS.INFO &&
          <ActorInfo />}
        {namespace === 'people' && tab === TABS.ACCOUNT &&
          <PersonAccount />}
        {namespace !== 'people' && tab === TABS.ADMINS &&
          <ActorAdmins />}
        {tab === TABS.ACCESS &&
          <ActorAccess />}
        {tab === TABS.FEATURES &&
          <ActorFeatures />}
        {canDelete && tab === TABS.DELETE &&
          <ActorDelete />}
      </ActorSettingCard>
    </>
  );
};

ActorsSettings.propTypes = {
  readActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
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
