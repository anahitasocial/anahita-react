import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediumCard from '../../components/cards/Medium';
import LikeAction from '../actions/Like';
import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';

import MediumMenu from './Menu';

const MediaCard = (props) => {
  const {
    medium,
    viewer,
    isAuthenticated,
  } = props;

  return (
    <MediumCard
      medium={medium}
      menu={isAuthenticated &&
        <MediumMenu
          medium={medium}
          viewer={viewer}
        />
      }
      actions={isAuthenticated &&
        <LikeAction
          node={medium}
          liked={medium.isVotedUp}
        />
      }
    />
  );
};

MediaCard.propTypes = {
  medium: MediumType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
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
