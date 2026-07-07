import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentStats from '../../components/CommentStats';
import LikesStats from '../likes';
import MediumCard from '../../components/MediumCard';

import MediumType from '../../proptypes/Medium';

const MediumNode = ({
  medium,
  handleView,
}) => {
  return (
    <MediumCard
      medium={medium}
      handleView={handleView}
      stats={
        <>
          <LikesStats node={medium} />
          <CommentStats node={medium} />
        </>
      }
    />
  );
};

MediumNode.propTypes = {
  medium: MediumType.isRequired,
  handleView: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {
    viewer,
    isAuthenticated,
  } = state.session;

  return {
    viewer,
    isAuthenticated,
  };
};

export default connect(mapStateToProps)(MediumNode);
