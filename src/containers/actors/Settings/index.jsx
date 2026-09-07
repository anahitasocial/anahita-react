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
import {
  getPersonSections,
  getGroupTabs,
  resolveSection,
  ITEMS,
} from './sections';

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

// The Delete tab reads "Danger zone", matching the person page, while the card
// inside it still reads "Delete" — the section names the risk, the card names
// the action. Every other tab is labelled by its own key.
const tabLabelKey = (namespace, key) => {
  if (key === TABS.DELETE) {
    return `${namespace}:settings.sections.danger`;
  }

  return `${namespace}:settings.${key}`;
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
  const isPerson = namespace === 'people';

  // People are addressed by their username, everything else by `<id>-<slug>`
  // — see utils/node.getURL, which builds the two differently.
  //
  // Splitting on the first hyphen is right for a group (`42-my-group` -> 42)
  // and wrong for a person: the username validator allows hyphens, so
  // `john-doe` resolved as `john` and anyone with a hyphen in their handle
  // could not open their own settings.
  const id = isPerson ? params.id : params.id.split('-')[0];

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

  // Falls back rather than trusting the stored value. The default used to be a
  // tab groups never render, which handed MUI a Tabs value it could not match —
  // a console warning and an empty body on every /groups/:id/settings load.
  const groupTabs = getGroupTabs({ canDelete });
  const activeTab = groupTabs.find((entry) => {
    return entry.key === tab;
  }) || groupTabs[0];

  const groupPanels = {
    [ITEMS.INFO]: <ActorInfo />,
    [ITEMS.ADMINS]: <ActorAdmins />,
    [ITEMS.ACCESS]: <ActorAccess />,
    [ITEMS.DELETE]: <ActorDelete />,
  };

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="on"
        value={activeTab.key}
        onChange={(e, newTab) => {
          setTab(newTab);
        }}
        aria-label={i18n.t('commons:settings')}
      >
        {groupTabs.map((entry) => {
          return (
            <Tab
              key={entry.key}
              label={i18n.t(tabLabelKey(namespace, entry.key))}
              value={entry.key}
            />
          );
        })}
      </Tabs>
      {/* Header only, with the panel stacked underneath — the same layout the
          person page uses, so a group's Danger zone looks like a person's
          rather than like a different application. */}
      <Box mb={2}>
        <ActorSettingCard
          actor={actor}
          subheader={i18n.t(tabLabelKey(namespace, activeTab.key))}
        />
      </Box>
      <SettingsItem
        bare={activeTab.bare}
        title={i18n.t(`${namespace}:settings.${activeTab.key}`)}
      >
        {groupPanels[activeTab.key]}
      </SettingsItem>
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
