/* eslint-disable no-console */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../../api';
import AuthlogsCard from './AuthlogsCard';
import actions from '../../../actions';
import i18n from '../../../languages';

const { authlogs: authlogsApi } = api;

const Authlogs = (props) => {
  const {
    personId,
    alertSuccess,
    alertError,
  } = props;

  const [authlogs, setAuthlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBrowse = (person) => {
    authlogsApi.browse(person)
      .then((response) => {
        if (response.status === 200) {
          setAuthlogs(response.data || []);
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

  const handleDelete = (authlog) => {
    const person = {
      id: personId,
    };
    setLoading(true);
    authlogsApi.deleteItem(person, authlog)
      .then((response) => {
        if (response.status === 200) {
          handleBrowse(person);
          alertSuccess(i18n.t('common:alerts.deleted'));
        }
      }).catch((err) => {
        console.error(err);
        alertError(i18n.t('common:alerts.error'));
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthlogsCard
      items={authlogs}
      handleDelete={handleDelete}
      loading={loading}
    />
  );
};

Authlogs.propTypes = {
  personId: PropTypes.string.isRequired,
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
)(Authlogs);
