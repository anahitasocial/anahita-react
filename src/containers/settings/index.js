import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import actions from '../../actions';
import i18n from '../../languages';

import SettingsAbout from './About';

const TABS = {
  ABOUT: 'about',
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
      </Tabs>
      {tab === TABS.ABOUT &&
        <SettingsAbout />}
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
