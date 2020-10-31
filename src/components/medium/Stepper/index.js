import React from 'react';
import PropTypes from 'prop-types';

import MediumType from '../../../proptypes/Medium';

import Default from './Default';

const Medium = (props) => {
  const {
    medium: {
      objectType,
    },
  } = props;

  switch (objectType) {
    default:
      return (
        <Default {...props} />
      );
  }
};

Medium.propTypes = {
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  locations: PropTypes.node,
  comments: PropTypes.node,
};

Medium.defaultProps = {
  actions: null,
  menu: null,
  locations: null,
  comments: null,
};

export default Medium;
