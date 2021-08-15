import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Browse from './Browse';
import actions from '../../actions/app';
import i18n from '../../languages';

const NotificationsBrowse = (props) => {
  const { setAppTitle } = props;

  useEffect(() => {
    setAppTitle(i18n.t('notifications:cTitle'));
  }, []);

  return (
    <Browse />
  );
};

NotificationsBrowse.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      setAppTitle: (title) => {
        return dispatch(actions.setAppTitle(title));
      },
    };
  };
};

const mapStateToProps = () => {
  return () => {
    return {};
  };
};

export default connect(
  mapStateToProps(),
  mapDispatchToProps(),
)(NotificationsBrowse);
