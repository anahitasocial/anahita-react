import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import Grid from '@material-ui/core/Grid';

import Composers from './composers/';
import StoriesBrowse from './stories/Browse';
import actions from '../actions';
import i18n from '../languages';

import PersonType from '../proptypes/Person';

const DashboardPage = (props) => {
  const {
    setAppTitle,
    sessionRead,
    viewer,
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t('dashboard:cTitle'));
    sessionRead();
  }, [setAppTitle, sessionRead]);

  const filters = {
    filter: 'leaders',
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{i18n.t('dashboard:cTitle')}</title>
      </Helmet>
      <Grid
        container
        justify="center"
      >
        <Grid
          item
          xs={12}
          md={8}
        >
          <Composers owner={viewer} />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
        >
          <StoriesBrowse
            key="com:stories.story"
            queryFilters={filters}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

DashboardPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  sessionRead: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.session;

  return {
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
    sessionRead: () => {
      return dispatch(actions.session.read());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPage);
