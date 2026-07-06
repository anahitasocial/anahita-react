import React from 'react';
import PropTypes from 'prop-types';

import MediumType from '../../../../proptypes/Medium';

import Default from './Default';

const MediumStepperLightbox = (props) => {
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

MediumStepperLightbox.propTypes = {
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  locations: PropTypes.node,
  comments: PropTypes.node,
};

MediumStepperLightbox.defaultProps = {
  actions: null,
  menu: null,
  locations: null,
  comments: null,
};

export default MediumStepperLightbox;
