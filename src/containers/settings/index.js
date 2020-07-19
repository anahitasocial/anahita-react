import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import * as actions from '../../actions';
import i18n from '../../languages';

import SettingsAbout from './About';
import SettingsApps from './Apps';
import SettingsConfigs from './Configs';
import SettingsPlugins from './Plugins';

const TABS = {
  ABOUT: 'about',
  CONFIGS: 'configs',
  APPS: 'apps',
  ASSIGNMENTS: 'assignments',
  PLUGINS: 'plugins',
};

const Settings = (props) => {
  const {
    setAppTitle,
  } = props;

  const [tab, setTab] = useState(TABS.APPS);

  useEffect(() => {
    setAppTitle(i18n.t('settings:cTitle'));
  }, []);

  return (
    <React.Fragment>
      <Tabs
        variant="scrollable"
        scrollButtons="on"
        value={tab}
        onChange={(e, newTab) => {
          setTab(newTab);
        }}
        aria-label="Site Settings"
      >
        <Tab label="About" value={TABS.ABOUT} />
        <Tab label="Configs" value={TABS.CONFIGS} />
        <Tab label="Apps" value={TABS.APPS} />
        <Tab label="App Assignments" value={TABS.ASSIGNMENTS} />
        <Tab label="Plugins" value={TABS.PLUGINS} />
      </Tabs>
      {tab === TABS.ABOUT &&
        <SettingsAbout />
      }
      {tab === TABS.CONFIGS &&
        <SettingsConfigs />
      }
      {tab === TABS.APPS &&
        <SettingsApps />
      }
      {tab === TABS.PLUGINS &&
        <SettingsPlugins />
      }
    </React.Fragment>
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
