import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import StoriesBrowse from './stories/Browse';
import appActions from '../actions/app';
import i18n from '../languages';

const DashboardPage = (props) => {
  const {
    setAppTitle,
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t('dashboard:cTitle'));
  }, []);

  const filters = {
    filter: 'leaders',
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{i18n.t('dashboard:cTitle')}</title>
      </Helmet>
      <StoriesBrowse
        key="com:stories.story"
        queryFilters={filters}
        {...this.params}
      />
    </React.Fragment>
  );
};

DashboardPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPage);
