import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActorSettingCard from '../../../components/ActorSetting';

import Admins from './admins/Browse';
import AuthLogs from '../../auth/Authlogs';
import WebAuthn from '../../auth/WebAuthn';
import Features from './Features';
import Delete from './Delete';
import Info from './Info';
import PersonAccount from '../../people/Settings/Account';
import PersonInfo from '../../people/Settings/Info';
import Access from './Access';
import Progress from '../../../components/Progress';

import actions from '../../../actions';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import i18n from '../../../languages';

const TABS = {
  ADMINS: 'admins',
  ACCOUNT: 'account',
  AUTHLOGS: 'authlogs',
  FEATURES: 'features',
  INFO: 'info',
  ACCESS: 'access',
  DELETE: 'delete',
  WEBAUTHN: 'webauthn',
};

const ActorsSettings = ({
  readActor,
  actor,
  viewer,
  alertSuccess,
  alertError,
  namespace,
  selectedTab = TABS.AUTHLOGS,
  isFetching,
  error,
  success,
}) => {
  const params = useParams();
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
      alertSuccess(i18n.t('prompts:updated.success'));
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

  // WebAuthn credentials belong to the current session's own account —
  // the endpoints are viewer-scoped and take no actor id — so the tab
  // only makes sense on the viewer's own profile.
  const isViewer = namespace === 'people' && actor.id === viewer.id;

  if (!actor.id) {
    return (
      <></>
    );
  }

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
        <Tab label={i18n.t(`${namespace}:settings.authlogs`)} value={TABS.AUTHLOGS} />
        {isViewer &&
          <Tab label={i18n.t(`${namespace}:settings.webauthn`)} value={TABS.WEBAUTHN} />}
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
        {namespace === 'people' && tab === TABS.AUTHLOGS &&
          <AuthLogs personId={actor.id} />}
        {isViewer && tab === TABS.WEBAUTHN &&
          <WebAuthn />}
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
  viewer: PersonType.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  selectedTab: PropTypes.oneOf([
    TABS.ADMINS,
    TABS.ACCOUNT,
    TABS.AUTHLOGS,
    TABS.INFO,
    TABS.DELETE,
  ]),
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

    const { viewer } = state.session;

    return {
      actor,
      viewer,
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
