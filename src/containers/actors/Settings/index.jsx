import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActorSettingCard from '../../../components/ActorSetting';

import Admins from './admins/Browse';
import AuthLogs from '../../auth/Authlogs';
import Password from '../../auth/Password';
import Username from '../../auth/Username';
import WebAuthn from '../../auth/WebAuthn';
import Email from '../../auth/Email';
import Totp from '../../auth/Totp';
import Delete from './Delete';
import Info from './Info';
import PersonInfo from '../../people/Settings/Info';
import Access from './Access';
import Progress from '../../../components/Progress';
import SettingsItem from './SettingsItem';
import { getPersonSections, resolveSection, ITEMS } from './sections';

import actions from '../../../actions';
import permissions from '../../../permissions/actor';
import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import i18n from '../../../languages';

// Tabs for the GROUPS namespace, which stays flat. See sections.js for why
// people are grouped and groups are not: a group has no account or security
// items, so there is nothing here to group.
const TABS = {
  ADMINS: 'admins',
  INFO: 'info',
  ACCESS: 'access',
  DELETE: 'delete',
};

const ActorsSettings = ({
  readActor,
  actor,
  viewer,
  alertSuccess,
  alertError,
  namespace,
  selectedTab = TABS.INFO,
  isFetching,
  error,
  success,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const [id] = params.id.split('-');
  const isPerson = namespace === 'people';

  // Groups only. People take their section from the URL below, which is what
  // makes it shareable and back-buttonable; this local state is the older
  // behaviour, kept for the namespace that is not being regrouped.
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

  if (isPerson) {
    const sections = getPersonSections({ isViewer, canDelete });
    const section = resolveSection(params.section, sections);

    // What each item key renders. Built here rather than in sections.js so that
    // module stays JSX-free and testable, and so the props these components
    // need — which differ per item — live next to the components.
    const panels = {
      [ITEMS.INFO]: <PersonInfo />,
      [ITEMS.EMAIL]: <Email />,
      [ITEMS.USERNAME]: <Username />,
      [ITEMS.PASSWORD]: <Password />,
      [ITEMS.TOTP]: <Totp viewer={viewer} />,
      [ITEMS.WEBAUTHN]: <WebAuthn />,
      [ITEMS.AUTHLOGS]: <AuthLogs personId={actor.id} />,
      [ITEMS.ACCESS]: <ActorAccess />,
      [ITEMS.DELETE]: <ActorDelete />,
    };

    return (
      <>
        <Tabs
          variant="scrollable"
          scrollButtons="on"
          value={section.key}
          onChange={(e, newSection) => {
            // push, not replace: the back button should walk the sections the
            // person visited rather than leaving the page entirely.
            navigate(`/people/${params.id}/settings/${newSection}`);
          }}
          aria-label={i18n.t('commons:settings')}
        >
          {sections.map((entry) => {
            return (
              <Tab
                key={entry.key}
                label={i18n.t(`people:settings.sections.${entry.key}`)}
                value={entry.key}
              />
            );
          })}
        </Tabs>
        {/* Header only — the section's cards stack underneath rather than
            inside, or every card would sit within another card's border.
            Matching the gap SettingsItem puts below each card, so the header
            does not sit flush against the first one. */}
        <Box mb={2}>
          <ActorSettingCard
            actor={actor}
            subheader={i18n.t(`people:settings.sections.${section.key}`)}
          />
        </Box>
        {section.items.map((item) => {
          return (
            <SettingsItem
              key={item.key}
              bare={item.bare}
              title={i18n.t(`people:settings.${item.key}`)}
            >
              {panels[item.key]}
            </SettingsItem>
          );
        })}
      </>
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
        <Tab label={i18n.t(`${namespace}:settings.info`)} value={TABS.INFO} />
        <Tab label={i18n.t(`${namespace}:settings.admins`)} value={TABS.ADMINS} />
        <Tab label={i18n.t(`${namespace}:settings.access`)} value={TABS.ACCESS} />
        {canDelete &&
          <Tab label={i18n.t(`${namespace}:settings.delete`)} value={TABS.DELETE} />}
      </Tabs>
      <ActorSettingCard
        actor={actor}
        subheader={i18n.t(`${namespace}:settings.${tab}`)}
      >
        {tab === TABS.INFO &&
          <ActorInfo />}
        {tab === TABS.ADMINS &&
          <ActorAdmins />}
        {tab === TABS.ACCESS &&
          <ActorAccess />}
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
  // Groups only. People no longer take a tab as a prop — their section comes
  // from the URL, so it survives a reload and the back button, which a value
  // read once into useState never did.
  selectedTab: PropTypes.oneOf([
    TABS.ADMINS,
    TABS.INFO,
    TABS.ACCESS,
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
