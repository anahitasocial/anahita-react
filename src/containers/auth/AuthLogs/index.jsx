/* eslint-disable no-console */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../../api';
import AuthLogsCard from './AuthLogsCard';
import actions from '../../../actions';
import i18n from '../../../languages';

const { authLogs: authLogsApi } = api;

const AuthLogs = (props) => {
  const {
    personId,
    alertSuccess,
    alertError,
  } = props;

  const [authLogs, setAuthLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBrowse = (person) => {
    authLogsApi.browse(person)
      .then((response) => {
        if (response.status === 200) {
          setAuthLogs(response.data || []);
        }
      }).catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const person = {
      id: personId,
    };

    handleBrowse(person);
  }, []);

  const handleDelete = (authLog) => {
    const person = {
      id: personId,
    };
    setLoading(true);
    authLogsApi.deleteItem(person, authLog)
      .then((response) => {
        if (response.status === 200) {
          handleBrowse(person);
          alertSuccess(i18n.t('prompts:deleted.success'));
        }
      }).catch((err) => {
        console.error(err);
        alertError(i18n.t('prompts:deleted.error'));
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLogsCard
      items={authLogs}
      handleDelete={handleDelete}
      loading={loading}
    />
  );
};

AuthLogs.propTypes = {
  personId: PropTypes.number.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLogs);
