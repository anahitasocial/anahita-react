import React from 'react';
import PropTypes from 'prop-types';

import MediumType from '../../../../proptypes/Medium';

import Default from './Default';

const MediumStepperLightbox = ({
  medium: {
    objectType,
  },
  ...props
}) => {
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

export default MediumStepperLightbox;
