import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ActorsBrowse from '../actors/browse';
import actions from '../../actions';
import i18n from '../../languages';

const Browse = ActorsBrowse('people');

const People = (props) => {
  const {
    setAppTitle,
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t('people:cTitle'));
  }, []);

  return (
    <Browse />
  );
};

People.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  return { viewer };
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(People);
