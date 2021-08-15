import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Browse from './Browse';
import actions from '../../actions/app';
import i18n from '../../languages';

const NotificationsBrowse = (props) => {
  const { setAppTitle } = props;

  useEffect(() => {
    setAppTitle(i18n.t('notifications:cTitle'));
  }, []);

  return (
    <Grid
      container
      justify="center"
    >
      <Grid
        item
        xs={12}
        md={8}
      >
        <Browse />
      </Grid>
    </Grid>
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
