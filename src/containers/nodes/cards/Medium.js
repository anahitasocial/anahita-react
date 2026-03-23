import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CommentStats from '../../../components/comment/Stats';
import LikesStats from '../../likes';
import MediumCard from '../../../components/cards/Medium';

import MediumType from '../../../proptypes/Medium';

const MediaCard = ({
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

MediaCard.propTypes = {
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

export default connect(mapStateToProps)(MediaCard);
