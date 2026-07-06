import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Progress from '../../../components/Progress';
import actions from '../../../actions';
import AboutType from '../../../proptypes/settings/About';

import SettingsAbout from './About';

const SettingsAboutContainer = ({
  readAbout,
  about,
  isFetching,
}) => {
  useEffect(() => {
    readAbout();
  }, [readAbout]);

  if (isFetching) {
    return <Progress />;
  }

  return (
    <SettingsAbout about={about} />
  );
};

SettingsAboutContainer.propTypes = {
  about: AboutType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  readAbout: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAbout: () => {
      dispatch(actions.settings.about.read());
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_about: {
      current: about,
    },
    isFetching,
  } = state.settingsAbout;

  return {
    about,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAboutContainer);
