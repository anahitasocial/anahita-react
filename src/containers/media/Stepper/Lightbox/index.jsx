import React from 'react';
import PropTypes from 'prop-types';

import MediumType from '../../../../proptypes/Medium';

import Default from './Default';

const MediumStepperLightbox = ({ medium, ...props }) => {
  const { objectType } = medium;

  switch (objectType) {
    default:
      return (
        <Default medium={medium} {...props} />
      );
  }
};

MediumStepperLightbox.propTypes = {
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  locations: PropTypes.node,
  comments: PropTypes.node,
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  handleNext: PropTypes.func,
  handlePrev: PropTypes.func,
};

export default MediumStepperLightbox;
