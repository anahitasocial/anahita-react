import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediumCard from '../../components/cards/Medium';
import LikeAction from '../likes/Read';
import Likes from '../likes';
import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';

import MediumMenu from './Menu';

const MediaCard = (props) => {
  const {
    medium,
    viewer,
    isAuthenticated,
    handleView,
  } = props;

  const Like = LikeAction(medium.objectType.split('.')[1]);

  return (
    <MediumCard
      medium={medium}
      handleView={handleView}
      menu={isAuthenticated &&
        <MediumMenu
          medium={medium}
          viewer={viewer}
        />
      }
      stats={
        <Likes node={medium} />
      }
      actions={isAuthenticated &&
        <Like node={medium} />
      }
    />
  );
};

MediaCard.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  handleView: PropTypes.func.isRequired,
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
