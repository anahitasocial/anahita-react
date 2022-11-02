import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import actions from '../../actions';
import i18n from '../../languages';

import SettingsAbout from './About';
import SettingsApps from './apps/Browse';
import SettingsAssignments from './assignments/Browse';
import SettingsPlugins from './plugins/Browse';

const TABS = {
  ABOUT: 'about',
  APPS: 'apps',
  ASSIGNMENTS: 'assignments',
  PLUGINS: 'plugins',
};

const Settings = (props) => {
  const {
    setAppTitle,
  } = props;

  const [tab, setTab] = useState(TABS.ABOUT);

  useEffect(() => {
    setAppTitle(i18n.t('settings:cTitle'));
  });

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="on"
        value={tab}
        onChange={(e, newTab) => {
          setTab(newTab);
        }}
        aria-label="Site Settings"
      >
        <Tab label={i18n.t('settings:about.mTitle')} value={TABS.ABOUT} />
        <Tab label={i18n.t('settings:apps.mTitle')} value={TABS.APPS} />
        <Tab label={i18n.t('settings:appAssignments.mTitle')} value={TABS.ASSIGNMENTS} />
        <Tab label={i18n.t('settings:plugins.mTitle')} value={TABS.PLUGINS} />
      </Tabs>
      {tab === TABS.ABOUT &&
        <SettingsAbout />}
      {tab === TABS.APPS &&
        <SettingsApps />}
      {tab === TABS.ASSIGNMENTS &&
        <SettingsAssignments />}
      {tab === TABS.PLUGINS &&
        <SettingsPlugins />}
    </>
  );
};

Settings.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
