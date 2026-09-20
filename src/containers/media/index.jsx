import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Browse from './Browse';
import { App as APP } from '../../constants';

const Media = ({
  namespace,
  queryFilters = {
    q: '',
    oid: 0,
    sort: APP.BROWSE.SORTING.RECENT,
  },
}) => {
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
  namespace: PropTypes.string.isRequired,
  queryFilters: PropTypes.object,
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
  )(Media);
};
