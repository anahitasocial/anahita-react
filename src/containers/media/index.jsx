import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Browse from './Browse';
import actions from '../../actions/app';
import { App as APP } from '../../constants';
import i18n from '../../languages';

const Media = ({
  setAppTitle,
  namespace,
  queryFilters = {
    q: '',
    oid: 0,
    sort: APP.BROWSE.SORTING.RECENT,
  },
}) => {
  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, [namespace]);

  const MediaBrowse = Browse(namespace);

  return (
    <MediaBrowse
      queryFilters={{
        ...queryFilters,
        sort: queryFilters.sort,
      }}
    />
  );
};

Media.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  queryFilters: PropTypes.object,
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

const mapStateToProps = (namespace) => {
  return () => {
    return {
      namespace,
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(),
  )(Media);
};
